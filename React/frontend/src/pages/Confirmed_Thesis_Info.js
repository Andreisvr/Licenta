import React, { useEffect, useState, useContext } from "react";
import "../page_css/ThesisInfo.css";

import { AppContext } from "../components/AppContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router-dom"; 

export default function Confirmed_Thesis_Info() {
    const navigate = useNavigate();
     const { conf } = useContext(AppContext); 
    console.log('obiect',conf);
    
    
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
                        <h2 className="thesisName"><strong>Title:</strong> {conf.thesis?.title}</h2>
                    </div>
                    <div className="date">
                        <p className="text_info">Confirmed: {formatDate(conf.date)}</p>
                     
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {conf.thesis?.faculty}</p>
                    
                    <p className="description"><strong>Description:</strong> {conf.thesis?.description}</p>
                    <p className="requirements"><strong>Requirements:</strong> {conf.thesis?.requirements}</p>
                    
                </form>
                
                <form className="right-form">
                    <h2>Profesor Name: {conf.professor?.name}</h2>
                 
                    <p className="text_info"><strong>Email:</strong>
                        <a href={`mailto:${conf.professor?.email}`} className="email-link">
                            {conf.professor?.email}
                        </a>
                    </p>
                    <p></p>
                    <p className="text_info"><strong>Student Name:</strong> {conf.student?.name}</p>
                    <p className="text_info"><strong>Student Email:</strong>{conf.student?.email}</p>
                   
                    <p className="text_info"><strong>Study Program:</strong> {conf.student?.ProgramStudy}</p>
                    <p></p>
                    <p className="text_info"><strong>Year:</strong> {conf.student?.study_year}</p>
                   
                  
                  
                    
                </form>
            </div>
        </div>
    );
}
