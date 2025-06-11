import React, { useState, useContext } from "react";
import { AppContext } from "../../components/AppContext";
import { useNavigate } from "react-router";

import BACKEND_URL from "../../server_link";
import SEND_URL from "../../email_link";

export default function Applied({ 
    thesisName, 
    faculty, 
    study_program, 
    applied_data,
    stud_email,
    student_program,
    stud_id,
    stud_name,
    study_year,
    id, 
 }) {

    // State to hold all applications fetched for the logged-in student
    const [allAplies, setAllAplies] = useState([]);
    // State to hold list of theses (used when filtering after deletion)
    const [theses, setTheses] = useState([]); 
    const navigate = useNavigate();

    // Get handlers from context to store selected thesis and student IDs globally
    const { handleThesisId, handleStud_id } = useContext(AppContext); 

    // Function to delete an application (withdraw thesis application)
    // If called from button click (origine==='buton'), also send rejection email
    async function handleAplication_delet(id, origine) {
        if (origine === 'buton') {
            SendEmail('rejected');  // Send rejection email to student
        }

        // Send DELETE request to backend to remove application by id
        fetch(`${BACKEND_URL}/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            // Remove withdrawn thesis from local state list
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        
        // Small delay before reload to ensure backend updated
        await new Promise((resolve) => setTimeout(resolve, 300));
    
        // Reload page to refresh data
        window.location.reload();
    }

    // Function to accept a student's application for a thesis
    async function handleAcceptStudent(thesisId, e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            // Get logged-in student info from localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            
            if (!studentId) {
                console.error("Student ID not found");
                return;
            }

            // Fetch all applications for the logged-in student
            const response = await fetch(`${BACKEND_URL}/aplies/${studentId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }

            const data = await response.json();
            setAllAplies(data);  
    
            // Find the specific application that matches the given thesisId
            const matchedApplication = data.find(application => application.id === thesisId);
    
            if (!matchedApplication) {
                console.error("No matching application found for thesis id:", thesisId);
                return;
            }
    
            // Prepare data structure for accepted application to send to backend
            const acceptedApplicationData = {
                id_thesis: matchedApplication.id_thesis,
                faculty: matchedApplication.faculty,
                title: matchedApplication.title,
                id_prof: matchedApplication.id_prof,
                prof_name: matchedApplication.prof_name,
                prof_email: matchedApplication.prof_email,
                stud_id: matchedApplication.id_stud,
                stud_email: matchedApplication.stud_email,
                stud_name: matchedApplication.stud_name,
                stud_program: matchedApplication.student_program,
                date: new Date().toISOString().split('T')[0],  // current date in yyyy-mm-dd
                origin: 'theses',
                cover_letter: matchedApplication.cover_letter,
            };
    
            // POST accepted application data to backend
            const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }
    
            console.log("Application accepted successfully:", acceptedApplicationData);
    
            SendEmail('accepted');  // Send acceptance email to student
            handleAplication_delet(thesisId, 'function');  // Remove application after acceptance
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }
    
    // Function to send email notification to student about acceptance or rejection
    async function SendEmail(answer) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const prof_name = userInfo.name;
        const prof_email = userInfo.email;
        
        // Email subject depending on acceptance or rejection
        const subject = answer === 'accepted'  
            ? 'Congratulations! Your application has been accepted'  
            : 'We are sorry! Your application was not accepted';  
    
        // Email body text depending on acceptance or rejection
        const text = answer === 'accepted'  
            ? `Dear ${stud_name},  
    
        We are pleased to inform you that your application for the thesis titled "${thesisName}" has been **accepted**.  

        Thesis Details: \n 
        - Title: ${thesisName}  \n 
        - Faculty: ${faculty} \n  
        - Professor: ${prof_name} \n  
        - Email: ${prof_email}\n   
        - Link: https://frontend-hj0o.onrender.com\n 
        
        Next steps: Please confirm this thesis if you choose to proceed with it, or you may wait for another acceptance and confirm the thesis you prefer.\n 
        Congratulations! We look forward to your success!  \n 

        Best regards, \n 
        [UVT]  \n 
        [Thesis Team]`

        : `Dear ${stud_name},  

            We regret to inform you that your application for the thesis titled "${thesisName}" has not been accepted.  
            We appreciate the effort and interest you have shown in this thesis topic. We encourage you to explore other available thesis opportunities and discuss alternative options with your faculty advisors.  
            If you have any questions or need further guidance, please do not hesitate to reach out. \n 
            Best wishes,\n
             - Link: https://frontend-hj0o.onrender.com\n   
            [UVT]  \n 
            [Thesis Team]`;
    
        try {
            // Send POST request to email sending service
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
    
    // Format ISO date string to dd/mm/yyyy format for display
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return '';  // Return empty string if invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
   
    // When user clicks the form, save thesis and student IDs in context and navigate to detailed view
    function go_info(){
        handleThesisId(id);
        handleStud_id(stud_id);
        navigate('/Applied_info');
    }

    // Shorten long thesis names to first 25 chars + ellipsis if over 100 chars
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <form className="applied_form" onClick={go_info}>
            <p className="text title">Title: {getShortDescription(thesisName)}</p>

            <p className="text">Student Name: {stud_name || "Loading..."}</p>
            <p className="text">Email: {stud_email || "Loading..."}</p>
            <p className="text">Student Program: {student_program || "Null"}</p>
            <p className="text">Study Year: {study_year || "Null"}</p>
            <p className="text">Applied Data: {formatDate(applied_data)}</p>
            
            <div className="button-container">
                {/* Accept button triggers accept function */}
                <button 
                    className="chose_btn" 
                    type="button" 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        handleAcceptStudent(id, e); 
                    }}
                >
                    Accept
                </button>

                {/* Decline button triggers delete/withdraw function */}
                <button 
                    className="chose_btn decline" 
                    type="button" 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        handleAplication_delet(id, 'buton'); 
                    }}
                >
                    Decline
                </button>
            </div>
        </form>
    );
}
