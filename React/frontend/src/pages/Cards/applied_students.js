
import React, { useState,useContext } from "react";
import { AppContext } from "../../components/AppContext";
import { useNavigate } from "react-router";



export default function Applied({ 
    thesisName, 
    faculty, 
    study_program, 
    applied_data,
    stud_email,
    student_program,
   
    stud_name,
    study_year,
    id, 
 }) {


    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]); 
    const navigate = useNavigate();
    const { handleThesisId } = useContext(AppContext); 

    function handleAplication_delet(id,e) {
       
        // e.preventDefault();
        // e.stopPropagation();

        SendEmail('rejected'); 
       
        fetch(`http://localhost:8081/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
            navigate('/prof');
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
           
    
            
            const response = await fetch(`http://localhost:8081/aplies/${studentId}`, {
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
            handleAplication_delet(thesisId);
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }
    
    async function SendEmail(answer) {
        const subject = answer === 'accepted'  
        ? 'Congratulations! Your application has been accepted'  
        : 'We are sorry! Your application was not accepted';  
    
    const text = answer === 'accepted'  
        ? `Hello, ${stud_name},\n\nCongratulations! Your application for the thesis "${thesisName}" has been accepted.`  
        : `Hello, ${stud_name},\n\nUnfortunately, your application for the thesis "${thesisName}" was not accepted.`;  
    
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
   
    function go_info(){
        handleThesisId(id);
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
                                handleAplication_delet(id,e); 
                            }}
                        >
                            Decline
                        </button>
                    </div>
               
            
    
           
        </form>
    );
}
