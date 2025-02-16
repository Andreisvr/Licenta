
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../components/AppContext";

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

  
    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]); 
    const { handleThesisId } = useContext(AppContext); 

   const navigate = useNavigate();

   if(state !='waiting')
   {
    return
   }
    

    function handlePropouse_Accepted(id) {
        console.log(`Accepting proposal with ID: ${id}`);
        fetch(`http://localhost:8081/proposalAcceptConfirm/${id}`, {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "accepted" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to accept thesis");
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "accepted" } : thesis
                )
            );
        })
        .catch(error => console.error("Error accepting thesis:", error));
       
        window.location.reload();
    }
    
    async function handlePropouse_reject(id,e) {
        // e.preventDefault();
        // e.stopPropagation();
        SendEmail('reject'); 
        console.log(`Rejecting proposal with ID: ${id}`);
       
        fetch(`http://localhost:8081/proposaReject/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "rejected" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to reject thesis");
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "rejected" } : thesis
                )
            );
        })
        .catch(error => console.error("Error rejecting thesis:", error));
       
        window.location.reload();
    }

    
    


    
    async function handleAcceptStudent(thesisId,e) {
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
                id_prof:professor_id,
                prof_name:professor_name,
                prof_email: 'propuse',
                stud_id: stud_id,
                stud_email:stud_email,
                stud_name: stud_name,
                stud_program: study_program,
                date: new Date().toISOString().split('T')[0],
                origin:'propouse'
            };
    
            
            
        
            const acceptResponse = await fetch("http://localhost:8081/acceptedApplications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }
    
            console.log("Application accepted successfully:", acceptedApplicationData);
    
            SendEmail('accepted'); 
            handlePropouse_Accepted(thesisId);
            navigate('/prof')
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }
   

    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 20)}${desc.length > 100 ? "..." : ""}` : "");


    function PropouseInfo()
    {
        handleThesisId(id); 
        navigate('/MyPropouse_Info');
    }


    async function SendEmail(answer) {
        const subject = answer === 'accepted'  
        ? 'Congratulations! Your Propose has been accepted'  
        : 'We are sorry! Your Propose was not accepted';  
    
    const text = answer === 'accepted'  
        ? `Hello, ${stud_name},\n\nCongratulations! Your Propose for the thesis with title: "${thesisName}" has been accepted.`  
        : `Hello, ${stud_name},\n\nUnfortunately, your Propose for the thesis with title :"${thesisName}" was not accepted.`;  
    
        try {
            const response = await fetch('http://localhost:5002/sendEmail', {
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
