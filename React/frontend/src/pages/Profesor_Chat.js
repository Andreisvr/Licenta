import React, { useState, useEffect, useContext} from "react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from '@mui/material/IconButton'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import "../page_css/My_thesis_page.css";


export default function ProfesorChatPage() {

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const thesis_id = JSON.parse(localStorage.getItem("thesis_id"));
    const stud_id =JSON.parse(localStorage.getItem("stud_id"));
    const messagesEndRef = useRef(null);
    const [thesis, setThesis] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);  
    const [stud,setStud] = useState('');
    const [isInfoVisible, setIsInfoVisible] = useState(true);

  // const BACKEND_URL = 'https://backend-08v3.onrender.com';
//  const SEND_URL = 'https://sender-emails.onrender.com';
const BACKEND_URL = 'http://localhost:8081';
const SEND_URL = 'http://localhost:5002';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom(); 
    }, [messages]);  

       
    
    useEffect(() => {
       
        if ( userInfo?.id) {
            fetch(`${BACKEND_URL}/read_messages/${userInfo.id}/${stud_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessages(data); 
                   
                })
                .catch((err) => console.error("Error fetching messages:", err));
        }
    }, [ userInfo?.id]);


    useEffect(() => {
       
        if (stud_id) {
            fetch(`${BACKEND_URL}/student_info/${stud_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                   setStud(data); 
                   console.log('student info ',stud);
                   
                })
                .catch((err) => console.error("Error fetching messages:", err));
        }
    }, [ stud_id]);

   
    useEffect(() => {
        if (userInfo?.id && thesis_id) { 
            fetch(`${BACKEND_URL}/get_thesis/${thesis_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    setThesis(data[0]);
                    
                })
                .catch((err) => console.error("Error fetching thesis:", err));
        }
    }, [ thesis_id]); 
    
    const sendMessage = () => {
        if (!message.trim()) return;
    
        const payload = {
            message: message,
            id_stud: stud_id,
            id_prof: userInfo?.id,
            sender: 'prof',
        };
    
        fetch(`${BACKEND_URL}/send_message`, {
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
                    sender: 'prof',
                };
     
               
                setMessages((prevMessages) => [...prevMessages, newMessage]);
    
                
                setMessage("");
                //window.location.reload();
            }
        })
        .catch((err) => console.error("Eroare la trimiterea mesajului:", err));
    };
    

    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 35)}${desc.length > 100 ? "..." : ""}` : "");
 
    function go_back(){
    navigate("/prof")
    localStorage.removeItem('thesis_id');

    localStorage.removeItem('stud_id');
    
   }


   const toggleInfoVisibility = () => {
    setIsInfoVisible(!isInfoVisible);
};

 return (
        <div className="body_chat_student">
            <button className="back_button" onClick={go_back}>
                <ArrowBackIcon />
            </button>
            <div className="chat_st">
                <div className="mesaje_lista">
                    {messages && messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className={`mesaj ${msg.sender === "prof" ? "right" : "left"}`}>
                                <p>{msg.mesaje}</p>
                                <p>
                                    <strong>{msg.sender === "prof" ? "you" : "student"}</strong> - {new Date(msg.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No messages yet</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="info_mesaje">
                    <p style={{ color: "#333" }}><strong>Name:</strong> {stud?.name || ''}</p>
                    <p style={{ color: "#333" }}><strong> Program:</strong> {getShortDescription(stud?.ProgramStudy) || ''}</p>
                    <p style={{ color: "#333" }}><strong> Year:</strong> {stud?.study_year || ''}</p>
                </div>

                <div className="mesaje_input">
                    <input 
                        type="text" 
                        className="mesaj_place" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                    />
                    <SendIcon className="send_btn" onClick={sendMessage} />
                </div>
            </div>

            <div className="info">
               
                <button className="dropdown-button" onClick={toggleInfoVisibility}>
                    {isInfoVisible ? "Hide Information" : "Show Information"}
                </button>

                {isInfoVisible && (
                    <div className="information">
                        <p><strong>Student Name:</strong> {userInfo?.name}</p>
                        <p>Email: 
                            <a href={`mailto:${userInfo?.email}`} className="email-link">
                                {userInfo?.email}
                            </a>
                        </p>
                        <p><strong>Title:</strong> {thesis?.title}</p>
                        <p><strong>Description:</strong> {thesis?.description}</p>
                    </div>
                )}

                
                {!isInfoVisible && (
                    <div className="additional-buttons">
                        <IconButton  className="calendar-icon"
                            component="a" 
                            href="https://calendar.google.com/calendar/u/0/r" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <CalendarTodayIcon className="calendar-icon" />
                        </IconButton>

                        {/* <button className="gmail-toggle-button">On Gmail/Off Gmail</button> */}
                    </div>
                )}
            </div>
        </div>
    );
}