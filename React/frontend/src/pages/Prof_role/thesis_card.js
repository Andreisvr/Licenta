import React from "react";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/addthesis.css';
import { AppContext } from "../../components/AppContext";

export default function AddThesis({ thesisName, date_start, date_end, faculty, study_program, description, professor_name, requirements, onClick }) {
    
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
        <form className="applied_form" onClick={onClick}>
            <p className="text title">Title: {thesisName}</p>
            <p className="text">Faculty: {faculty} {study_program && `(Program: ${study_program})`}</p>
            <p className="text description">Description: {description}</p>
            {requirements && (
                <p className="text requirements">Requirements: {requirements}</p>
            )}
            <p className="text">Professor: {professor_name}</p>
           
            <div className="add_date">
                <p className="text">{formatDate(date_start)}</p>
                <p className="text">{formatDate(date_end)}</p>
            </div>
        </form>
    );
}
