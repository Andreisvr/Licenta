// AddApplies.js
import React, { useContext, useEffect, useState } from "react";

export default function Accepted({ 
    thesisName, 
    faculty, 
    study_program, 
    applied_data,
    stud_email,
    student_program,
    professor_name,

    stud_name,
   
    id, 
 }) {


    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]); 
   
    function handleAplication_delet(id) {
       
        console.log(id);
        fetch(`http://localhost:8081/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
       
        window.location.reload();
        
    }

    async function handleAcceptStudent(thesisId) {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            
            if (!studentId) {
                console.error("Student ID not found");
                return;
            }
            console.log(studentId);
    
            
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
                date: new Date().toISOString().split('T')[0]
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
    
           
             handleAplication_delet(thesisId);
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
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
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <form className="applied_form">
            <p className="text title">Title: {getShortDescription(thesisName)}</p>
    
    
            
                    <p className="text ">Prof Name: {professor_name}</p>
                    <p className="text">Student: {stud_name || "Loading..."}</p>
                    <p className="text">Student Email: {stud_email || "Loading..."}</p>
                    {/* <p className="text">Faculty: {faculty} {study_program && `Program: ${study_program}`}</p>
                  */}
                        <p className="text">Accepted Data: {formatDate(applied_data)}</p>
                    
                        
            
    
           
        </form>
    );
}
