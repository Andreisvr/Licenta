// AddApplies.js
import React ,{useEffect} from "react";
//fgfkmdl,sas,ladfghfgdsaSDFGHJKLJHGFDSADSFGH
export default function AddResponse({ 
    thesisName, 
    faculty, 
    study_program, 
    student_name,
   data,
    
   id_thesis,
   id_prof,
   id_stud,
   cover_letter,
  
    id, 
 }) {

    
    function handleResponse_delet(id) {
        console.log(id);

        fetch(`http://localhost:8081/response/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
           
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
       
        window.location.reload();
    }


    async function handleAcceptStudent(thesisId) {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            
            
    
            const acceptedApplicationData = {
                id_thesis: id_thesis,
                id_prof: id_prof,
                id_stud: id_stud,
                date: new Date().toISOString().split('T')[0] ,
                // cover_letter:cover_letter
            };
            console.log('data accepted ',acceptedApplicationData);

    
            const confirmResponse = await fetch("http://localhost:8081/confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (confirmResponse.status === 400) {
                alert("Limita de locuri disponibile a fost completată.");
                return;
            }
    
            if (!confirmResponse.ok) {
                throw new Error("Failed to confirm application");
            }
    
            console.log("Application confirmed successfully:", acceptedApplicationData);
           
            // handleResponse_delet(id_stud);
    
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
   
    return (
        <form className="applied_form">
            <p className="text title">responsed_card: {thesisName}</p>
               
                    <p className="text">Student: {student_name || "Loading..."}</p>
                    <p className="text">Faculty: {faculty} {study_program && `Program: ${study_program}`}</p>
                    <p className="text">Applied Date: {formatDate(data)}</p>
                   <br/>
                        <button 
                            className="chose_btn" 
                            type="button" 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleAcceptStudent(id); 
                            }}
                        >
                            Confirm
                        </button>
                            
                        <p style={{
                                fontSize: '14px',
                                color: '#888',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                marginTop: '10px'
                            }}>
 You can confirm only one thesis. After confirmation, other responses will be deleted.
</p>

                  
               
            
    
           
        </form>
    );
}
