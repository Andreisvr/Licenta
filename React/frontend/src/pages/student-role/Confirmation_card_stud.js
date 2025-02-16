
import React ,{useEffect} from "react";

export default function AddResponse({ 
    thesisName, 
    faculty, 
    study_program, 
    student_name,
    data,
    cover_letter,
    prof_email,
    id_thesis,
    id_prof,
    id_stud,
    
  
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

    async function handleChangeState(stud_id) {

        {
         
            fetch(`http://localhost:8081/proposalAcceptConfirm/${id_thesis}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "confirmed" }), 
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to accept thesis");
               
            })
            .catch(error => console.error("Error accepting thesis:", error));
           
            window.location.reload();
        }
        
    }



    async function handleConfirm(thesisId) {
        
        if (!window.confirm("Are you sure you want to confirm this thesis? After confirming, you won't be able to choose another one. If you make a mistake, please contact the admin.")) return;


    
        if(prof_email !='propuse'){
        try {
            console.log('din theses')
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
    
            const acceptedApplicationData = {
                id_thesis: id_thesis,
                id_prof: id_prof, 
                id_stud: studentId,
                date: new Date().toISOString().split('T')[0],
                cover_letter:cover_letter
            };
    
            console.log("1Data accepted:", acceptedApplicationData);
    
            const confirmResponse = await fetch("http://localhost:8081/confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData),
            });
    
            
    
            if (!confirmResponse.ok) {
                
                
                throw new Error("Failed to confirm application");
            }
    
            console.log("Application confirmed successfully:", acceptedApplicationData);
    
            
              handleResponse_delet(studentId);
    
        } catch (error) {
            console.error("Error in Confirm Aplication Student:", error);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
    
            
        }}else{

            
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const studentId = userInfo.id;
        
                const acceptedApplicationData = {
                    id_thesis: id_thesis,
                    id_prof: id_prof, 
                    id_stud: studentId,
                    date: new Date().toISOString().split('T')[0],
                    origin:'propouse',
                    cover_letter:cover_letter
                };
        
               
        
                const confirmResponse = await fetch("http://localhost:8081/confirmationPropouse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(acceptedApplicationData),
                });
        
                if (!confirmResponse.ok) {
                    
                    
                    throw new Error("Failed to confirm application");
                }
        
                console.log("Application confirmed successfully:", acceptedApplicationData);
        
                   handleChangeState(studentId)
                  handleResponse_delet(studentId);
        
            } catch (error) {
                console.error("Error in  Confirm Propouse:", error);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const studentId = userInfo.id;
        
            }

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
            <p className="text title">Titde: {getShortDescription(thesisName)}</p>
               
                    <p className="text">Student: {student_name || "Loading..."}</p>
                    <p className="text">Faculty: {faculty} {study_program && `Program: ${study_program}`}</p>
                    <p className="text">Applied Date: {formatDate(data)}</p>
                   <br/>
                        <button 
                            className="chose_btn" 
                            type="button" 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleConfirm(id_thesis,e); 
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
