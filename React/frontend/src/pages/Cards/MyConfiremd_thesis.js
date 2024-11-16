// AddApplies.js
import React ,{useEffect} from "react";

export default function MyConfirmed({ 
    
         id,
         id_prof,
         id_thesis,
         date,
         id_stud
        
 }) {

    
    
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
            <p className="text title">Title: {id_thesis}</p>
               
                    {/* <p className="text">Student: {student_name || "Loading..."}</p>
                    <p className="text">Faculty: {faculty} {study_program && `Program: ${study_program}`}</p>
                    <p className="text">Applied Date: {formatDate(data)}</p>
                   <br/> */}
                      
                  
               
            
    
           
        </form>
    );
}
