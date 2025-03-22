
import React, { useState,useContext } from "react";
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


    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]); 
    const navigate = useNavigate();
    const { handleThesisId , handleStud_id} = useContext(AppContext); 

 
   async function handleAplication_delet(id,origine) {
       
       
    if(origine ==='buton'){
       
        SendEmail('rejected');
     }
       
        fetch(`${BACKEND_URL}/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        
        await new Promise((resolve) => setTimeout(resolve, 300));
    
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
           
    
            
            const response = await fetch(`${BACKEND_URL}/aplies/${studentId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }
    
            const data = await response.json();
            setAllAplies(data);  
    
          
            const matchedApplication = data.find(application => application.id === thesisId);
         
    
            if (!matchedApplication) {
                console.error("No matching application found for thesis id:", thesisId);
                return;
            }
    
          
          
            
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
                date: new Date().toISOString().split('T')[0],
                origin:'theses',
                 cover_letter: matchedApplication.cover_letter,


                
            };
    
            
            
        
            const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }
    
            console.log("Application accepted successfully:", acceptedApplicationData);
    
            SendEmail('accepted'); 
            handleAplication_delet(thesisId,'function');
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }
    
    async function SendEmail(answer) {

       

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const prof_name = userInfo.name;
        const prof_email = userInfo.email;
        
        const subject = answer === 'accepted'  
            ? 'Congratulations! Your application has been accepted'  
            : 'We are sorry! Your application was not accepted';  
    
        const text = answer === 'accepted'  
            ? `Dear ${stud_name},  
    
        We are pleased to inform you that your application for the thesis titled "${thesisName}" has been **accepted**.  

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

            We regret to inform you that your application for the thesis titled "${thesisName}" has    Not been accepted.  
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
    
    

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return ''; 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
   
    function go_info(){
        handleThesisId(id);
        handleStud_id(stud_id);
       navigate('/Applied_info')

    }

    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <form className="applied_form" onClick={go_info}>
            <p className="text title">Title: {getShortDescription(thesisName)}</p>
    
    
            
                   
                    <p className="text">Student Name: {stud_name || "Loading..."}</p>
                    <p className="text">Email: {stud_email || "Loading..."}</p>
                    
                    <p className="text ">Student Program: {student_program||"Null"}</p>
                    <p className="text ">Study Year: {study_year||"Null"}</p>
                    
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
                                handleAplication_delet(id,'buton'); 
                            }}
                        >
                            Decline
                        </button>
                    </div>
               
            
    
           
        </form>
    );
}
