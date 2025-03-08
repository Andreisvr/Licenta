
import React from "react";
import { useEffect,useContext,useState} from "react";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Applied_Info(){
    const navigate = useNavigate();
  
    const { thesis_id,type} = useContext(AppContext); 
    const [isLoading, setIsLoading] = useState(true); 
    const [thesisData, setThesisData] = useState(null);
    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]);

    // const BACKEND_URL = 'https://backend-08v3.onrender.com';
    // const SEND_URL = 'https://sender-emails.onrender.com';
    const BACKEND_URL = 'http://localhost:8081';
    const SEND_URL = 'http://localhost:5002';


    useEffect(() => {
        const fetchData = async () => {
            if (!thesis_id) {
                console.warn("thesis_id is undefined or null, skipping fetch.");
                return;
            }
           
            try {
                const response = await fetch(`${BACKEND_URL}/Applied_info/${thesis_id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch thesis data');
                }

                const data = await response.json();

                if (data.length > 0) {
                    setThesisData(data[0]); 
                } else {
                    console.warn("No data found for thesis_id:", thesis_id);
                }
            } catch (error) {
                console.error('Error fetching proposals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
       
    }, [thesis_id]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleWithdraw = (id,e) => {
       
       
       
        console.log(id);
        fetch(`${BACKEND_URL}/myaply/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        navigate('/prof');
        window.location.reload();
        

      
    };
   
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) {
            return ''; 
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    }

    function handleAplication_delet(id,e,origin) {
       
       // e.preventDefault();
       // e.stopPropagation();

        if(origin === 'buton'){
       SendEmail('rejected'); 
        }

        fetch(`${BACKEND_URL}/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        
        navigate('/prof');
         window.location.reload();
        
    }


    async function handleAcceptStudent(thesisId,e,origin) {
        e.preventDefault(); 
        e.stopPropagation();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            
            if (!studentId) {
                console.error("Student ID not found");
                return;
            }
           
    
            
            const response = await fetch(`${BACKEND_URL}/aplies/${studentId}`, {
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
                date: new Date().toISOString().split('T')[0],
                origin:'theses',
                 cover_letter: matchedApplication.cover_letter,


                
            };
    
            
            
        
            const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }
    
           // console.log("Application accepted successfully:", acceptedApplicationData);
          
            SendEmail('accepted'); 
           
             navigate('/prof')
             handleAplication_delet(thesisId,origin);
    
        } catch (error) {
            console.error("Error in handleAcceptStudent:", error);
        }
    }
    
    async function SendEmail(answer) {
        const subject = answer === 'accepted'  
            ? 'Congratulations! Your application has been accepted'  
            : 'We are sorry! Your application was not accepted';  
    
        const text = answer === 'accepted'  
            ? `Dear ${thesisData?.stud_name},  
    
        We are pleased to inform you that your application for the thesis titled "${thesisData.title}" has been Accepted.  

        Thesis Details:\n 
        - Title: ${thesisData.title}  \n 
        - Faculty: ${thesisData.faculty}  \n 
        - Professor: ${thesisData.prof_name} \n  
        - Email: ${thesisData.prof_email}\n   
        - Link: https://frontend-hj0o.onrender.com\n 
        Next steps: Please confirm this thesis if you choose to proceed with it, or you may wait for another acceptance and confirm the thesis you prefer.  

        Congratulations! We look forward to your success!  

        Best regards,\n  
        [UVT]  \n 
        [Thesis Team]`

        : `Dear ${thesisData?.stud_name},  

            We regret to inform you that your application for the thesis titled "${thesisData.title}" has Not been accepted.  

            We appreciate the effort and interest you have shown in this thesis topic. We encourage you to explore other available thesis opportunities and discuss alternative options with your faculty advisors.  

            If you have any questions or need further guidance, please do not hesitate to reach out.  

            Best wishes,\n 
            [UVT]  \n 
            [Thesis Team]`;
    
        try {
            const response = await fetch(`${SEND_URL}/sendEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: thesisData?.stud_email, subject, text })
            });
    
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
    
            console.log(`Email sent successfully to ${thesisData?.stud_email}`);
    
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
    
    const handleBack = () => {
        navigate("/prof");
            };
   
    return (
        <div className="body_thesisinfo">
            <div className="form-container">
                <form className="left-form">
                    <div className="header-container">
                        <button type="button" className="back-button" onClick={handleBack}>
                            <ArrowBackIcon />
                        </button> 
                        <h2 className="thesisName"><strong>Title:</strong> {thesisData.title || 'null'}</h2>
                    </div>
                    <div className="date">
                        <p className="in_date">Applied Data: {formatDate(thesisData.applied_data) || 'null'}</p>
                        
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {thesisData.faculty || 'null'}</p>
                    
                    <p className="description" style={{ height: '55vh', overflow:'auto'}}>
        <strong>Cover Letter:</strong> {thesisData.cover_letter || 'null'}
    </p>
                    <div className="buton_gr">
                        {(type === "professor" || type === 1) && (
                                <>
                                    <button className="accept-button"  onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleAcceptStudent(thesisData?.id,e,'funct'); 
                                }} >Accept</button>

                                    <button className="decline-button" onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleAplication_delet(thesisData?.id,e,'buton'); 
                                }}>Decline</button>
                                </>
                        )}
                    </div>
                    <div className="buton_gr">
                    {(type === "student" || type === 0) && (
                               
                                 <button 
                        className="withdraw_btn" 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleWithdraw(thesisData?.id); 
                        }}
                    >
                        Withdraw Aplication
                    </button>
                             
                        )}
                    </div>
                </form>
                
                <form className="right-form">
                        <h2>Name:{thesisData?.stud_name || 'null'}</h2>
                        <p style={{ color: "#333" }}>Email: 
                            <a href={`mailto:${thesisData?.stud_email}` || 'null'} className="email-link">
                                {thesisData?.stud_email}
                            </a>
                        </p>
                        <p style={{ color: "#333" }}>Faculty: {thesisData?.faculty}</p>
                        <p style={{ color: "#333" }}>Study Program: {thesisData?.student_program}</p>
                        <p style={{ color: "#333" }}>Study year: {thesisData?.study_year || 'null'}</p>
                        <p style={{ color: "#333" }}>Profesor Name: {thesisData?.prof_name || 'null'}</p>
                        <p style={{ color: "#333" }}>Profesor Email: 
                            <a href={`mailto:${thesisData?.prof_email}` || 'null'} className="email-link">
                                {thesisData?.prof_email}
                            </a>
                        </p>
                       

                        
                    </form>
            </div>
        </div>
    );
    }
