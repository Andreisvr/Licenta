
import React ,{useEffect} from "react";

export default function MyThesis({ 
    thesisName, 
    faculty, 
    study_program,  
    date_start,
    date_end,
    professor_name,
    viewType,
    id, 
 }) {

    const handleWithdraw = (id) => {
        console.log(id);
        fetch(`http://localhost:8081/prof/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        window.location.reload();
    };


    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return ''; 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
   
    return (
        <form className="applied_form">
            <p className="text title">Title: {thesisName}</p>
               
                 
                    <p className="text">Faculty: {faculty} {study_program && `Program: ${study_program}`}</p>
                    <div className="add_date">
                        <p className="text">{formatDate(date_start)}</p>
                        <p className="text">{formatDate(date_end)}</p>
                    </div>
                    
                    <button 
                        className="withdraw_btn" 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleWithdraw(id); 
                        }}
                    >
                        Withdraw Thesis
                    </button>
               
            
    
           
        </form>
    );
}
