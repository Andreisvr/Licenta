import React, { useEffect, useState } from "react";

import "../page_css/ThesisInfo.css"

export default function ThesisInfo() {
    const [thesisData, setThesisData] = useState(null);

    useEffect(() => {
        const savedThesis = localStorage.getItem('selectedThesis');
        if (savedThesis) {
            setThesisData(JSON.parse(savedThesis));
            console.log(savedThesis);
        }
    }, []);

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

    return (
        <div className="body_thesisinfo">
            <div className="form-container">
                <form className="left-form">
                    <h2 className="thesisName">{thesisData.title}</h2>
                    <div className="date">
                        <p className="in_date">{formatDate(thesisData.start_date)}</p>
                        <p className="off_date">{formatDate(thesisData.end_date)}</p>
                    </div>
                    <p className="faculty-name">{thesisData.faculty}</p>
                    <p className="study-program">{thesisData.study_program}</p>
                    <p className="description">{thesisData.description}</p>
                    <div className="apply-favorite-container">
                        <button type="submit" className="apply-button">Apply</button>
                    </div>
                </form>
                
                <form className="right-form">
                    <h2>{thesisData.professor_name}</h2>
                    <p>Email: {thesisData.professor_email}</p>
                    <p>Facultatea: {thesisData.faculty}</p>
                    <textarea placeholder="Mesaj opțional..." className="optional-message" />
                    <button type="submit" className="send-button">Send</button>
                </form>
            </div>
        </div>
    );
}
