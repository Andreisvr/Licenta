import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppContext } from "../components/AppContext";

import "../page_css/My_thesis_page.css";
export default function StudentChatPage() {
    const { logined } = useContext(AppContext);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const messagesEndRef = useRef(null);
    const [confirmed, setConfirmed] = useState(null);
    const [profesor, setProfesor] = useState(null);
    const [thesis, setThesis] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);  

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom(); 
    }, [messages]);  

       
    
    useEffect(() => {
        if (logined && userInfo?.id) {
            fetch(`http://localhost:8081/get_info_my_th_page/${userInfo.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((response) => response.json())
                .then((data) => {
                    setConfirmed(data);
                })
                .catch((error) =>
                    console.error("Error fetching user info:", error)
                );
        }
    }, [logined, userInfo?.id]);

    useEffect(() => {
        if (confirmed) {
            let thesisFetch;
            
            if (confirmed.origin === "theses") {
                thesisFetch = fetch(`http://localhost:8081/these_s/${confirmed.id_thesis}/${confirmed.id_prof}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }).then((res) => res.json());
            } else if (confirmed.origin === "propouse") {
                thesisFetch = fetch(`http://localhost:8081/propus_e/${userInfo.id}/${confirmed.id_thesis}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }).then((res) => res.json());
            }

            const profesorFetch = fetch(`http://localhost:8081/profesori_neverificat_i/${confirmed.id_prof}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }).then((res) => res.json());

            Promise.all([thesisFetch, profesorFetch])
                .then(([thesisData, profData]) => {
                    setThesis(thesisData[0]);
                    setProfesor(profData[0]);
                    console.log("Theses/Propuse response:", thesisData);
                    console.log("Profesori_neverificati response:", profData);
                })
                .catch((err) => console.error("Error in fetch:", err));
        }
    }, [confirmed]);

    useEffect(() => {
        if (profesor && userInfo?.id) {
            fetch(`http://localhost:8081/read_messages/${profesor.id}/${userInfo.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessages(data); 
                    console.log('mesajeel',data);
                })
                .catch((err) => console.error("Error fetching messages:", err));
        }
    }, [profesor, userInfo?.id]);



    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 35)}${desc.length > 100 ? "..." : ""}` : "");

    const sendMessage = () => {
        if (!message.trim()) return;

        const payload = {
            message: message,
            id_stud: userInfo.id,
            id_prof: profesor?.id,
            sender:'stud'
        };

        fetch("http://localhost:8081/send_message", {
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
                    sender: 'stud',
                };
    
               
                setMessages((prevMessages) => [...prevMessages, newMessage]);
    
                
                setMessage("");
            }
        })
        .catch((err) => console.error("Eroare la trimiterea mesajului:", err));
    };

    return (
        <div className="body_chat_student">
            <button className="back_button" onClick={() => navigate("/prof")}>
                <ArrowBackIcon />
            </button>
            <div className="chat_st">
            <div className="mesaje_lista">
                    {messages && messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={msg.id} className={`mesaj ${msg.sender === "stud" ? "right" : "left"}`}>
                                <p>{msg.mesaje}</p>
                                <p>
                                    <strong>{msg.sender === "stud" ? "you" : "profesor"}</strong> - {new Date(msg.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No messages yet</p>
                    )}
                     <div ref={messagesEndRef} />
                </div>
                 
            
                <div className="info_mesaje">
                    <p><strong></strong> {profesor?.name || ''}</p>
                    <p><strong>,</strong> {getShortDescription(thesis?.description) || ''}</p>
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
                {profesor && (
                    <div>
                        <h3>Profesor</h3>
                        <p><strong>Nume:</strong> {profesor.name}</p>
                        <p>Email: 
                            <a href={`mailto:${profesor.email}`} className="email-link">
                                {profesor.email}
                            </a>
                        </p>
                        <h3>Teza</h3>
                        <p><strong>Titlu:</strong> {getShortDescription(thesis.title)}</p>
                        <p><strong>Descriere:</strong> {getShortDescription(thesis.description)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
