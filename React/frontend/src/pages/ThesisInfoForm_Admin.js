import React, { useEffect, useState, useContext } from "react";

import "../page_css/ThesisInfo.css";
import { AppContext } from "../components/AppContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router-dom"; 
import BACKEND_URL from "../server_link";

export default function ThesisInfo_Admin() {
    
    const [thesisData, setThesisData] = useState(null);
   
    const navigate = useNavigate(); 
     
    const { thesis_id } = useContext(AppContext); 
    useEffect(() => {
        const isAdmin = localStorage.getItem('admin');
    if (isAdmin !== 'admin') {
      
      navigate("/login"); 
    } else {
        fetch(`${BACKEND_URL}/thesis_admin?id=${thesis_id}`)
                .then((response) => response.json())
                .then((data) => {
                    setThesisData(data);
                   
                })
                .catch((error) => console.error("Error fetching theses:", error));

        
            }
    }, [thesis_id]);

   
    
    
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

    if (!thesisData) return <p>Loading...</p>;

   
    
    const handleBack = () => {
        navigate("/Admin_Page");
    };
   
  
    return (
        <div className="body_thesisinfo">
            <div className="form-container">
                <form className="left-form">
                    <div className="header-container">
                        <button type="button" className="back-button" onClick={handleBack}>
                            <ArrowBackIcon />
                        </button>
                        <h2 className="thesisName"><strong>Title:</strong> {thesisData.title}</h2>
                    </div>
                    <div className="date">
                        <p className="text_info">Start: {formatDate(thesisData.start_date)}</p>
                        <p className="text_info">End: {formatDate(thesisData.end_date)}</p>
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {thesisData.faculty}</p>
                    
                    <p className="description"><strong>Description:</strong> {thesisData.description}</p>
                    <p className="requirements"><strong>Requirements:</strong> {thesisData.requirements}</p>
                    
                </form>
                
                <form className="right-form">
                    <h2>Profesor Name: {thesisData.prof_name}</h2>
                 
                    <p className="text_info">Email: 
                        <a href={`mailto:${thesisData?.email}`} className="email-link">
                            {thesisData?.email}
                        </a>
                    </p>
                    <p></p>
                    <p className="text_info">Facultatea: {thesisData.faculty}</p>
                  
                  
                    
                </form>
            </div>
        </div>
    );
}
