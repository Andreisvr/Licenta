// Import necessary modules and components
import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../components/AppContext";
import BACKEND_URL from "../../server_link";

// Component for displaying an applied thesis entry
export default function MyApplied({ 
    thesisName, 
    faculty, 
    study_program, 
    applied_data,
    professor_name,
    study_year,
    stud_name,
    prof_email,
    professor_id,
    id, 
}) {
    const navigate = useNavigate();
    const { handleThesisId, handleStud_id } = useContext(AppContext); 

    // Format ISO date string into dd/mm/yyyy format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return ''; 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Function to withdraw an application by deleting it from the backend
    const handleWithdraw = async (id) => {
        fetch(`${BACKEND_URL}/myaply/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
       
        // Wait a short moment to ensure backend updates
        await new Promise((resolve) => setTimeout(resolve, 350));

        // Reload page to reflect changes
        window.location.reload();
    };

    // Navigate to the applied thesis info page and store IDs in context
    function go_info() {
        handleThesisId(id);
        handleStud_id(professor_id);
        navigate('/Applied_info');
    }

    console.log(professor_id); // Debug log of professor ID

    // Helper to get a shortened version of a title or description
    const getShortDescription = (desc) => 
        (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");

    // Render the applied thesis form
    return (
        <form className="applied_form" onClick={go_info}>
            <p className="text title">Title: {getShortDescription(thesisName)}</p>
            <p className="text ">Professor Name: {professor_name}</p>
            <p className="text">Email: {prof_email || "Loading..."}</p>
            <p className="text">Faculty: {faculty} {study_program && `Program: ${study_program}`}</p>
            <p className="text ">Applied Date: {formatDate(applied_data)}</p>
            
            {/* Button to withdraw the application; stops click from triggering navigation */}
            <button 
                className="withdraw_btn" 
                type="button" 
                onClick={(e) => {
                    e.stopPropagation(); 
                    handleWithdraw(id); 
                }}
            >
                Withdraw Aplication
            </button>
        </form>
    );
}
