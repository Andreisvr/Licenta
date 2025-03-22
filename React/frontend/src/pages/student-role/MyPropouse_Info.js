import React from "react";
import { useNavigate } from "react-router";
import { useEffect,useContext,useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import "../../page_css/MyPropouse_Info.css";

import { AppContext } from "../../components/AppContext";
import BACKEND_URL from "../../server_link";
import SEND_URL from "../../email_link";

export default function MyPropouse_Info()
{

    const navigate = useNavigate();
    const [thesisData, setThesisData] = useState(null);
  
    const [theses, setTheses] = useState([]); 
    const userInfo_info = JSON.parse(localStorage.getItem("userInfo"));
    
    
    const stud_id =JSON.parse(localStorage.getItem("stud_id"));

    const { thesis_id,type} = useContext(AppContext); 
    const [studyYear, setStudyYear] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    

      const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };
        
        useEffect(() => {
            scrollToBottom(); 
        }, [messages]);  
       

        useEffect(() => {
            console.log(userInfo_info.id,stud_id);

            if ( type == 'student') {
                fetch(`${BACKEND_URL}/read_messages_selection/${userInfo_info.id}/${stud_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        const filteredMessages = data.filter(msg => msg.location === "Propose");
                        setMessages(filteredMessages); 
                        // console.log(data);
                       
                    })
                    .catch((err) => console.error("Error fetching messages:", err));
            }else{
                if(type == 'professor'){
                    fetch(`${BACKEND_URL}/read_messages_selection/${stud_id}/${userInfo_info.id}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            const filteredMessages = data.filter(msg => msg.location === "Propose");
                            setMessages(filteredMessages);
                           
                        })
                        .catch((err) => console.error("Error fetching messages:", err));
                }
            }
        }, []);

        
    useEffect(() => {
        const fetchData = async () => {
            if (!thesis_id) {
                console.warn("thesis_id is undefined or null, skipping fetch.");
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/MyPropouse/${thesis_id}`);

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

    useEffect(() => {
        if (!thesisData?.stud_id) return;  
        const id = thesisData?.stud_id;
       
    
        const fetchStudyYear = async () => {
            try {
               
                const response = await fetch(`${BACKEND_URL}/student_info/${id}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch study year");
                }
    
                const data = await response.json();
               
    
                setStudyYear(data.study_year); 
              
            } catch (error) {
                console.error("Error fetching study year:", error);
            }
        };
    
        fetchStudyYear();
    }, [thesisData]);
    

    if (isLoading) {
        return <div>Loading...</div>;
    }
   

    const handleBack = () => {
        navigate("/prof");
    };

   

  


    async  function handlePropouse_Accepted(id) {
        
        console.log(`Accepting proposal with ID: ${id}`);
        fetch(`${BACKEND_URL}/proposalAcceptConfirm/${id}`, {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "accepted" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to accept thesis");
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "accepted" } : thesis
                )
            );
        })
        .catch(error => console.error("Error accepting thesis:", error));
        
        SendEmail('accepted'); 
       
        await new Promise((resolve) => setTimeout(resolve, 300));

        navigate("/prof");
    }
    
    async function handlePropouse_reject(id,e) {

        e.preventDefault();
        e.stopPropagation();
        console.log(`Rejecting proposal with ID: ${id}`);
        fetch(`${BACKEND_URL}/proposaReject/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "rejected" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to reject thesis");
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "rejected" } : thesis
                )
            );
        })
        .catch(error => console.error("Error rejecting thesis:", error));
       
        SendEmail('reject'); 
       
        await new Promise((resolve) => setTimeout(resolve, 300));

        navigate('/prof')
       
      
    }
    


    
    async function handleAcceptStudent(thesisId,e) {
        e.preventDefault();
        e.stopPropagation();
         try {
           const userInfo = JSON.parse(localStorage.getItem('userInfo'));
           const studentId = userInfo.id;
         
           
           if (!studentId) {
               console.error(" ID not found");
               return;
           }
           
           
           const acceptedApplicationData = {
               id_thesis: thesisData?.id,
               faculty:thesisData?.faculty,
               title:thesisData?.title,
               id_prof:thesisData?.prof_id,
               prof_name:thesisData?.prof_name,
               prof_email: 'propose',
               stud_id:thesisData?.stud_id,
               stud_email:thesisData?.stud_email,
               stud_name:thesisData?.stud_name,
               stud_program:thesisData?.study_program,
               date: new Date().toISOString().split('T')[0],
               origin:'propose'
           };
   
           
           const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(acceptedApplicationData)
           });
   
           if (!acceptResponse.ok) {
               throw new Error("Failed to accept application");
           }
   
           console.log("Application accepted successfully:", acceptedApplicationData);
   
           navigate('/prof')
           handlePropouse_Accepted(thesisId);
          
       } catch (error) {
           console.error("Error in handleAcceptStudent:", error);
       }
   }

  async function handleWithdrawApplication(id,e) {
    e.preventDefault();
    e.stopPropagation();
   
    fetch(`${BACKEND_URL}/withdrawApplication/${id}`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to withdraw thesis");
        console.log("Thesis withdrawn successfully.");
    })
    .catch(error => console.error("Error withdrawing thesis:", error));
   
    await new Promise((resolve) => setTimeout(resolve, 350));

    navigate('/prof');
    };


    async function SendEmail(answer) {
       
        const subject = answer === 'accepted'  
            ? 'Congratulations! Your Propose has been accepted'  
            : 'We are sorry! Your Propose was not accepted';  
    
        const text = answer === 'accepted'  
            ? `Dear ${thesisData?.stud_name},  
    
        We are pleased to inform you that your propose for the thesis titled "${thesisData.title}" has been Accepted.  

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

            We regret to inform you that your propose for the thesis titled "${thesisData.title}" has Not been accepted.  

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
    

    const sendMessage = () => {

        

        if (!message.trim()) return;
    
        let payload = {};
    
        if (type === "professor" || type === 1) {
            
            payload = {
                message: message,
                id_prof: userInfo_info?.id,  
                id_stud: thesisData?.stud_id, 
                sender: 'prof',  
                location: 'Propose',
            };
        } else {
            
            payload = {
                message: message,
                id_prof: thesisData?.prof_id, 
                id_stud: thesisData?.stud_id,  
                sender: 'stud', 
                location: 'Propose',
            };
        }
        
       
       

       
    
        fetch(`${BACKEND_URL}/send_message_select`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Mesaj trimis cu succes:", data);
    
            if (data && data.message) {
                const newMessage = {
                    id: data.id,
                    id_stud: data.id_stud,
                    id_prof: data.id_prof,
                    mesaje: data.message,
                    created_at: new Date().toISOString(),
                    sender: payload.sender,  
                };
    
                setMessages((prevMessages) => [...prevMessages, newMessage]);
    
                
                setMessage("");
                
            }
        })
        .catch((err) => console.error("Eroare la trimiterea mesajului:", err));
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

    return (
        <div className="body_thesisinfo">
            <div className="form-container" >
                <form className="left-form">
                    <div className="header-container">
                        <button  className="back-button" onClick={handleBack}>
                            <ArrowBackIcon />
                        </button>
                        <h2 className="thesisName" style={{ 
                            whiteSpace: 'normal', 
                            wordWrap: 'break-word', 
                            overflowY: 'auto', 
                            minHeight: '8vh', 
                            maxHeight: '20vh' 
                            }}>
                            <strong>Titlu:</strong> {thesisData?.title}
                            </h2>
                    </div>
                    <div className="date">
                        <p className="in_date">Apply Date: {formatDate(thesisData?.date)}</p>
    
                    </div>
                    <p style={{ color: "#333" }} className="faculty-name"><strong>Faculty:</strong> {thesisData?.faculty}</p>
                    <p className="study-program"><strong>StudyProgram:</strong> {thesisData?.study_program}</p>
                    <p className="description" style={{ height: '55vh', overflow:'auto'}}><strong>Description:</strong> {thesisData?.description}</p>
                    <p className="requirements"><strong>Motivation:</strong> {thesisData?.motivation}</p>
                    <div className="buton_gr">
                    {(type === "professor" || type === 1) && (
                            <>
                                <button className="accept-button"  onClick={(e) => {
                                e.stopPropagation(); 
                                handleAcceptStudent(thesisData?.id,e); 
                            }} >Accept</button>

                                <button className="decline-button" onClick={(e) => { 
                                e.stopPropagation(); 
                                handlePropouse_reject(thesisData?.id,e); 
                            }}>Decline</button>
                            </>
                    )}
                </div>
                <div className="buton_gr">
                    {(type === "student" || type === 0) && (
                           <button className= 'withdraw_btn' onClick={(e) => handleWithdrawApplication(thesisData?.id,e)}>Remove</button>
            
                    )}
                </div>
                </form>
                
                <form className="right-form">
                    <h2 style={{ color: "#333" }} >Name:{thesisData?.stud_name}</h2>
                    <p style={{ color: "#333" }} >Email: 
                        <a href={`mailto:${thesisData?.stud_email}`} className="email-link">
                            {thesisData?.stud_email}
                        </a>
                    </p>
                    <p style={{ color: "#333" }}>Faculty: {thesisData?.faculty}</p>
                    <p style={{ color: "#333" }}>Study Program: {thesisData?.study_program}</p>
                    <p style={{ color: "#333" }}>Study year: {studyYear || 'null'}</p>
                    <p style={{ color: "#333" }}>Profesor Name: {thesisData?.prof_name || 'null'}</p>
                    <p style={{ color: "#333" }}>Answer: {thesisData?.state || 'null'}</p>

                   
                    
                    <div className="mesaj_lista">
                        {messages && messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div key={msg.id} className={`mesaj ${msg.sender === "prof" ? "right" : "left"}`}>
                                    <p style={{color:'black'}}>{msg.message}</p>
                                    <p>
                                   
                                        <strong>{msg.sender === "stud" ? "student" : "profesor"}</strong> - {new Date(msg.date).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No messages yet</p>
                        )}
                        <div ref={messagesEndRef} />
                         <div className="mesaj_input">
                        
                        <input 
                            type="text" 
                            className="mesaj_place" 
                            value={message} 
                             onChange={(e) => setMessage(e.target.value)} 
                        />
                        <SendIcon className="send_btn" onClick={sendMessage} />
                    </div>
                    
                 </div>
                
                    </form>
               
            </div>
        </div>
    );
}
