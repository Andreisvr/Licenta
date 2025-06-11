
import React ,{useEffect} from "react";
import { AppContext } from "../../components/AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router";

import BACKEND_URL from "../../server_link";
import SEND_URL from "../../email_link";

export default function AddResponse({ 
    thesisName, 
    faculty, 
    study_program, 
    student_name,
    data,
    cover_letter,
    prof_email,
    prof_name,
    id_thesis,
    id_prof,
    id_stud,
    stud_email,
  
    id, 
 }) {
    const navigate = useNavigate();
    const { handleThesisId} = useContext(AppContext); 
   
    async function handleResponse_delet(id) {
       

        fetch(`${BACKEND_URL}/response/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
           
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        
      
    
    }

    async function handleChangeState(stud_id) {

        {
         
            fetch(`${BACKEND_URL}/proposalAcceptConfirm/${id_thesis}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "confirmed" }), 
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to accept thesis");
               
            })
            .catch(error => console.error("Error accepting thesis:", error));
            
            
           
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
    
           
            const confirmResponse = await fetch(`${BACKEND_URL}/confirmation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData),
            });
    
            
    
            if (!confirmResponse.ok) {
                
                
                throw new Error("Failed to confirm application");
            }
    
           
            handleChangeState(studentId)
            SendEmail();
            handleResponse_delet(studentId);
            
            await new Promise((resolve) => setTimeout(resolve, 350));

            window.location.reload();
    
        } catch (error) {
            console.error("Error in Confirm Aplication Student:", error);
           
            
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
        
               
        
                const confirmResponse = await fetch(`${BACKEND_URL}/confirmationPropouse`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(acceptedApplicationData),
                });
        
                if (!confirmResponse.ok) {
                    
                    
                    throw new Error("Failed to confirm application");
                }
        
                
                const profResponse = await fetch(`${BACKEND_URL}/getProfessor/${id_prof}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                
                if (!profResponse.ok) {
                    throw new Error("Failed to fetch professor details");
                }
                
                const professorData = await profResponse.json();
              
                handleChangeState(studentId)
                SendEmail(professorData);
                handleResponse_delet(studentId);
               
                await new Promise((resolve) => setTimeout(resolve, 350));

               window.location.reload();
        
            } catch (error) {
                console.error("Error in  Confirm Propouse:", error);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const studentId = userInfo.id;
        
            }

        }


    }


    async function SendEmail(professorData) {
        let subject = 'Congratulations! Your Thesis Application Has Been Confirmed';

        let text = `Dear ${student_name},\n\n
        Congratulations! We are pleased to inform you that your thesis application titled: "${thesisName}" has been confirmed. 
        Your thesis will be supervised by Professor ${prof_name}. You can contact them via email: ${prof_email} or website chat for further instructions or questions.\n\n
        We wish you the best of luck with your thesis work!\n\n
        Kind regards,\nThe Thesis Department`;
        
        try {
            const response = await fetch(`${SEND_URL}/sendEmail`, {
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

        subject = 'Student Thesis Confirmation';
        
        text = `Dear Professor ${prof_name},\n\n
        We are happy to inform you that your student, ${student_name} (email: ${stud_email}), has successfully confirmed their thesis titled: "${thesisName}". 
        This thesis is now officially assigned to you as the supervising professor. Please feel free to reach out to the student for any further steps or assistance.\n\n
        Kind regards,\nThe Thesis Department`;
        
        try {
            const response = await fetch(`${SEND_URL}/sendEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: professorData.email, subject, text})
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            console.log(`Email sent successfully to ${prof_email}`);

        } catch (error) {
            console.error('Error sending email:', error);
        }

    
    }


    function goInfo(id){
        handleThesisId(id);
       
        navigate('/Confirm_Info')
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
        <form className="applied_form"  onClick={() => {goInfo(id_thesis); }}>
            <p className="text title">Tite: {getShortDescription(thesisName)}</p>
               
                    <p className="text">Profesor Email: {prof_email || "Loading..."}</p>
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
