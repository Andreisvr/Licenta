
import React from "react";
import { useEffect,useContext,useState} from "react";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BACKEND_URL from "../server_link";
import SEND_URL from "../email_link";
import { useRef } from "react";
import SendIcon from "@mui/icons-material/Send";

export default function Applied_Info(){
    const navigate = useNavigate();
  
    const { thesis_id,type} = useContext(AppContext); 
    const [isLoading, setIsLoading] = useState(true); 
    const [thesisData, setThesisData] = useState(null);
    const [allAplies, setAllAplies] = useState([]);
    const [theses, setTheses] = useState([]);
    const userInfo_info = JSON.parse(localStorage.getItem("userInfo"));
    
   const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    
    const stud_id =JSON.parse(localStorage.getItem("stud_id"));

    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom(); 
    }, [messages]); 

   
    useEffect(() => {
        // Log IDs for debugging: current user and selected student
        console.log(userInfo_info.id, stud_id);
    
        // Fetch messages depending on user type: student or professor
        if (type === 'student') {
            // For students, fetch messages where current user is sender and stud_id is receiver
            fetch(`${BACKEND_URL}/read_messages_selection/${userInfo_info.id}/${stud_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    // Filter messages to only those in the "Applies" location/category
                    const filteredMessages = data.filter(msg => msg.location === "Applies");
                    setMessages(filteredMessages);  
                    // console.log(filteredMessages); 
                })
                .catch((err) => console.error("Error fetching messages:", err));
        } else if (type === 'professor') {
            // For professors, fetch messages where stud_id is sender and current user is receiver
            fetch(`${BACKEND_URL}/read_messages_selection/${stud_id}/${userInfo_info.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    // Filter messages to only those in the "Applies" location/category
                    const filteredMessages = data.filter(msg => msg.location === "Applies");
                    setMessages(filteredMessages);  
                    // console.log(filteredMessages);  
                })
                .catch((err) => console.error("Error fetching messages:", err));
        }
    }, []);  // Run once on mount
    
    
    useEffect(() => {
        // Fetch thesis data when thesis_id changes
        const fetchData = async () => {
            if (!thesis_id) {
                // If no thesis_id provided, skip fetching
                console.warn("thesis_id is undefined or null, skipping fetch.");
                return;
            }
           
            try {
                // Fetch thesis application info from backend
                const response = await fetch(`${BACKEND_URL}/Applied_info/${thesis_id}`);
    
                if (!response.ok) {
                    // If response is not OK, throw error
                    throw new Error('Failed to fetch thesis data');
                }
    
                const data = await response.json();
    
                if (data.length > 0) {
                    // Set thesis data to first returned item
                    setThesisData(data[0]); 
                } else {
                    // Warn if no data found for the given thesis_id
                    console.warn("No data found for thesis_id:", thesis_id);
                }
            } catch (error) {
                // Log any fetch or parsing errors
                console.error('Error fetching proposals:', error);
            } finally {
                // Stop loading spinner regardless of success or failure
                setIsLoading(false);
            }
        };
    
        fetchData();
       
    }, [thesis_id]);  // Re-run when thesis_id changes
    
    
    if (isLoading) {
        // Show loading message while data is being fetched
        return <div>Loading...</div>;
    }
    
    // Function to withdraw an application by deleting it from backend
    const handleWithdraw = async (id, e) => {
        console.log(id);
    
        fetch(`${BACKEND_URL}/myaply/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
    
        // Wait briefly before navigation to allow backend changes to settle
        await new Promise((resolve) => setTimeout(resolve, 300));
    
        // Navigate back to professor page after withdrawal
        navigate('/prof');
    };
    
    // Helper function to format ISO date strings into DD/MM/YYYY
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) {
            return ''; // Return empty string if invalid date
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    }
    
    // Function to delete an application and optionally send rejection email
    async function handleAplication_delet(id, e, origin) {
        e.preventDefault();
    
        if(origin === 'buton'){
            // Send rejection email only if origin is button click
            SendEmail('rejected'); 
        }
       
        fetch(`${BACKEND_URL}/accept/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            // Remove deleted thesis from local state list
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        
        // Wait briefly to ensure backend update before navigation
        await new Promise((resolve) => setTimeout(resolve, 300));
    
        // Navigate to professor dashboard after deletion
        navigate('/prof');
    }
    
    // Function to accept a student's application
    async function handleAcceptStudent(thesisId, e, origin) {
        e.preventDefault(); 
        e.stopPropagation();
        try {
            // Get user info from local storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const studentId = userInfo.id;
            
            if (!studentId) {
                console.error("Student ID not found");
                return;
            }
    
            // Fetch all applications by this student
            const response = await fetch(`${BACKEND_URL}/aplies/${studentId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }
    
            const data = await response.json();
            setAllAplies(data);  
    
            // Find the application that matches the given thesisId
            const matchedApplication = data.find(application => application.id === thesisId);
    
            if (!matchedApplication) {
                console.error("No matching application found for thesis id:", thesisId);
                return;
            }
    
            // Prepare accepted application data to be saved
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
                date: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD
                origin: 'theses',
                cover_letter: matchedApplication.cover_letter,
            };
    
            // POST accepted application data to backend
            const acceptResponse = await fetch(`${BACKEND_URL}/acceptedApplications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(acceptedApplicationData)
            });
    
            if (!acceptResponse.ok) {
                throw new Error("Failed to accept application");
            }
    
            // Send acceptance email notification
            SendEmail('accepted'); 
            
            // Delete the application from the pending list
            handleAplication_delet(thesisId, e, origin);
    
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


    const sendMessage = () => {

        

        if (!message.trim()) return;
    
        let payload = {};
    
        if (type === "professor" || type === 1) {
            
            payload = {
                message: message,
                id_prof: userInfo_info?.id,  
                id_stud: stud_id, 
                sender: 'prof',  
                location: 'Applies',
            };
        } else {
            
            payload = {
                message: message,
                id_prof: stud_id, 
                id_stud: userInfo_info?.id,  
                sender: 'stud', 
                location: 'Applies',
            };
        }
        
       
       

       console.log(payload);
    
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
