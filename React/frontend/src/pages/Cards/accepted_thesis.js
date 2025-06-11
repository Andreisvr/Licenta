import React, { useState } from "react";

import { useNavigate } from "react-router";
import BACKEND_URL from "../../server_link";

// Component to display accepted thesis information and manage acceptance/withdrawal actions
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

    // Hook for navigation between routes
    const navigate = useNavigate(); 

    // State to store all applications fetched from backend
    const [allAplies, setAllAplies] = useState([]);
    // State to store thesis list, used for local filtering after deletion
    const [theses, setTheses] = useState([]); 
   
    // Function to delete a thesis application by ID
    function handleAplication_delet(id) {
        console.log(id); // Log id for debugging

        // Send DELETE request to backend to remove accepted thesis application
        fetch(`${BACKEND_URL}/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            // Check for successful response
            if (!response.ok) throw new Error("Failed to withdraw thesis");

            // Remove deleted thesis from local state to update UI
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
       
        // After deletion, navigate back to /prof page
        navigate("/prof");
    }

    // Async function to handle acceptance of a student's application for a thesis
    async function handleAcceptStudent(thesisId) {
        try {
            // Retrieve logged-in user info from localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            
            if (!studentId) {
                console.error("Student ID not found");
                return;
            }
            console.log(studentId);
    
            // Fetch all applications for the logged-in student
            const response = await fetch(`${BACKEND_URL}/aplies/${studentId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }
    
            // Parse fetched application data
            const data = await response.json();
            setAllAplies(data);  
    
            // Find the application matching the given thesis ID
            const matchedApplication = data.find(application => application.id === thesisId);
    
            if (!matchedApplication) {
                console.error("No matching application found for thesis id:", thesisId);
                return;
            }
    
            // Prepare accepted application data to send to backend
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
                date: new Date().toISOString().split('T')[0] // current date in YYYY-MM-DD format
            };
    
            // Send POST request to backend to record the accepted application
            const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }
    
            console.log("Application accepted successfully:", acceptedApplicationData);
    
            // After accepting, delete the original application from 'accept' endpoint
            handleAplication_delet(thesisId);
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }
    
    // Helper function to format ISO date string as dd/mm/yyyy
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return ''; // handle invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
   
    // Helper to truncate thesis name for display, max 25 chars plus "..." if longer than 100
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <form className="applied_form">
            {/* Display truncated thesis title */}
            <p className="text title">Title: {getShortDescription(thesisName)}</p>
    
            {/* Display professor name */}
          
           <p className="text ">Prof Name: {professor_name}</p>
            {/* Display student name or loading if not available */}
            <p className="text">Student: {stud_name || "Loading..."}</p>
            {/* Display student email or loading */}
            <p className="text">Student Email: {stud_email || "Loading..."}</p>
            {/* Display formatted accepted date */}
            
            <p className="text">Accepted Data: {formatDate(applied_data)}</p>
        </form>
    );
}
