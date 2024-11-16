import React, { useState } from "react";

export default function MyPropouses({ 

    thesisName, 
    professor_id,
    applied_data,
    user_id,
    professor_name,
    stud_name,
    
    id
}) {
    // Funcția pentru a formata data
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return ''; 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    
    function handleWithdrawApplication(id) {
        console.log(id);
        fetch(`http://localhost:8081/withdrawApplication/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            console.log("Thesis withdrawn successfully.");
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
    }

    return (
        <form className="applied_form">
           
              
                <p className="title text">Title: {thesisName}</p>
                <p className="text">Professor: {professor_name}</p>
                <p className="text">Student: {stud_name || "Loading..."}</p>
              
                <p className="text">Applied Date: {formatDate(applied_data)}</p>
                <button className= 'withdraw_btn' onClick={() => handleWithdrawApplication(id)}>Withdraw</button>
            
        </form>

      
        
    );
}
