import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../components/AppContext";
import BACKEND_URL from "../../server_link";

export default function MyPropouses({ 

    thesisName, 
    professor_id,
    applied_data,
    professor_name,
    description,
   
    state,
    id
}) 
{
   // Get functions from AppContext and navigation hook from react-router-dom
const { handleThesisId, handleStud_id } = useContext(AppContext);
const navigate = useNavigate();

// Get logged-in user info from localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

// Function to handle clicking on a proposal to show detailed info
function MyPropouses_Info() {
    // Set the selected thesis ID and professor ID in context
    handleThesisId(id);
    handleStud_id(professor_id);

    // Navigate to the detailed proposal info page
    navigate('/MyPropouse_Info');
}

// Skip rendering if the proposal state is accepted or confirmed
if (state == 'accepted' || state == 'confirmed') {
    return;
}

// Helper function to format an ISO date string into dd/mm/yyyy
function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    // Return empty string if date is invalid or zero timestamp
    if (date.getTime() === 0) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Function to withdraw a thesis application by its ID
async function handleWithdrawApplication(id, e) {
    e.preventDefault();
    e.stopPropagation();

    console.log(id);

    // Send DELETE request to backend to withdraw the application
    fetch(`${BACKEND_URL}/withdrawApplication/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to withdraw thesis");
        console.log("Thesis withdrawn successfully.");
    })
    .catch(error => console.error("Error withdrawing thesis:", error));

    // Wait a bit before reloading to allow backend processing
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Reload the page to reflect changes
    window.location.reload();
}

// Helper to get a short preview of a description string (first 25 chars)
// Appends "..." if description is longer than 100 characters
const getShortDescription = (desc) => 
    desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "";

    return (
        <form className="applied_form" onClick={MyPropouses_Info}>
           
              
                <p className="title text">Title: {getShortDescription(thesisName)}</p>
                <p className="text">Professor: {professor_name}</p>
                <p className="text">Description: {getShortDescription(description) || "Loading..."}</p>
                <p className="text" >Answer : {state}</p>
                <p className="text">Applied Date: {formatDate(applied_data)}</p>
               

                <button className= 'withdraw_btn' onClick={(e) => handleWithdrawApplication(id,e)}>Remove</button>
            
        </form>

      
        
    );
}
