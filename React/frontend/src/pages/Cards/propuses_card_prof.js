import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../components/AppContext";
import BACKEND_URL from "../../server_link";
import SEND_URL from "../../email_link";

// Component for displaying and managing a thesis proposal
export default function Propouses({ 
    thesisName,
    professor_name,
    professor_id,
    stud_id,
    applied_data,
    stud_name,
    stud_email,
    faculty,
    study_program,
    description,
    id,
    state
}) {
    // Local state to manage thesis applications and proposals
    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]); 

    // Context to share selected thesis/student across components
    const { handleThesisId, handleStud_id } = useContext(AppContext); 

    const navigate = useNavigate();

    // Do not render anything if the proposal is not in 'waiting' state
    if (state != 'waiting') {
        return;
    }

    // Handle accepting a thesis proposal by updating state in the backend
    async function handlePropouse_Accepted(id) {
        console.log(`Accepting proposal with ID: ${id}`);

        fetch(`${BACKEND_URL}/proposalAcceptConfirm/${id}`, {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "accepted" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to accept thesis");
            // Update local state after successful backend update
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "accepted" } : thesis
                )
            );
        })
        .catch(error => console.error("Error accepting thesis:", error));
       
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        // Reload page and navigate to professor dashboard
        window.location.reload();
        navigate("/prof");
    }

    // Handle rejecting a thesis proposal
    async function handlePropouse_reject(id, e) {
        SendEmail('reject'); // Notify student by email
        console.log(`Rejecting proposal with ID: ${id}`);

        fetch(`${BACKEND_URL}/proposaReject/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "rejected" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to reject thesis");
            // Update local state after successful backend update
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "rejected" } : thesis
                )
            );
        })
        .catch(error => console.error("Error rejecting thesis:", error));
        
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Reload page and navigate to professor dashboard
        window.location.reload();
        navigate("/prof");
    }

    // Confirm acceptance of a student and create an accepted application
    async function handleAcceptStudent(thesisId, e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            if (!studentId) {
                console.error("Student ID not found");
                return;
            }

            const acceptedApplicationData = {
                id_thesis: id,
                faculty: faculty,
                title: thesisName,
                id_prof: professor_id,
                prof_name: professor_name,
                prof_email: 'propuse',
                stud_id: stud_id,
                stud_email: stud_email,
                stud_name: stud_name,
                stud_program: study_program,
                date: new Date().toISOString().split('T')[0],
                origin: 'propouse'
            };

            // Send accepted application to backend
            const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });

            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }

            console.log("Application accepted successfully:", acceptedApplicationData);

            SendEmail('accepted'); // Notify student by email
            handlePropouse_Accepted(thesisId); // Update status and reload page

        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }

    // Shorten description for UI display
    const getShortDescription = (desc) =>
        (desc ? `${desc.substring(0, 20)}${desc.length > 100 ? "..." : ""}` : "");

    // Navigate to detailed proposal info page and store selected data in context
    function PropouseInfo() {
        handleThesisId(id); 
        navigate('/MyPropouse_Info');
        handleStud_id(stud_id);
    }

    // Send email notification (accepted/rejected) to student
    async function SendEmail(answer) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const prof_name = userInfo.name;
        const prof_email = userInfo.email;
        
        const subject = answer === 'accepted'  
            ? 'Congratulations! Your Propose has been accepted'  
            : 'We are sorry! Your Propose was not accepted';  
    
        const text = answer === 'accepted'  
            ? `Dear ${stud_name},  
        We are pleased to inform you that your propose for the thesis titled "${thesisName}" has been Accepted.  
        Thesis Details: \n 
        - Title: ${thesisName}  \n 
        - Faculty:${faculty} \n  
        - Professor: ${prof_name} \n  
        - Email: ${prof_email}\n   
        - Link: https://frontend-hj0o.onrender.com\n 
        Next steps: Please confirm this thesis if you choose to proceed with it, or you may wait for another acceptance and confirm the thesis you prefer.\n 
        Congratulations! We look forward to your success!  \n 
        Best regards, \n 
        [UVT]  \n 
        [Thesis Team]`
        : `Dear ${stud_name},  
        We regret to inform you that your propose for the thesis titled "${thesisName}" has Not been accepted.  
        We appreciate the effort and interest you have shown in this thesis topic. We encourage you to explore other available thesis opportunities and discuss alternative options with your faculty advisors.  
        If you have any questions or need further guidance, please do not hesitate to reach out. \n 
        Best wishes,\n 
        - Link: https://frontend-hj0o.onrender.com\n  
        [UVT]  \n 
        [Thesis Team]`;

        try {
            const response = await fetch(`${SEND_URL}/sendEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: stud_email, subject, text })
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            console.log(`Email sent successfully to ${stud_email}`);

        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Format date string to DD/MM/YYYY
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return ''; 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    return (
        <form className="applied_form" onClick={PropouseInfo}>
            <p className="text title">Title: {getShortDescription(thesisName)}</p>
    
    
            
                    
                    <p className="text">Student: {stud_name || "Loading..."}</p>
                    <p className="text">Student Email: {stud_email || "Loading..."}</p>
                    <p className="text">Description : {getShortDescription(description) || "Loading..."}</p>
                    
                        <p className="text">Applied Data: {formatDate(applied_data)}</p>
                    
                        <div className="button-container">
                        <button 
                            className="chose_btn" 
                            type="button" 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleAcceptStudent(id,e); 
                            }}
                        >
                            Accept
                        </button>
    
                        <button 
                            className="chose_btn decline" 
                            type="button" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                handlePropouse_reject(id,e); 
                            }}
                        >
                            Decline
                        </button>
                    </div>
               
            
    
           
        </form>
    );
}
