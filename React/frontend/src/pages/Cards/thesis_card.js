import React from "react";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/addthesis.css';

export default function AddThesis({ 
    thesisName, 
    faculty, 
    study_program, 
    description,
    requirements,
    date_start,
    date_end,
    professor_name, 
    student_name,
    applied_data, 
    onAccept,
    onDecline,
    onClick, 
    onWithdraw,
    onWithdrawApplication, 
    viewType 
}) {
    
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

            {viewType === "ALL" && (
                <>
                    <p className="text">Faculty: {faculty} {study_program && `(Program: ${study_program})`}</p>
                    <p className="text">Professor: {professor_name}</p>
                    
                    <p className="text description">Description: {description}</p>
                    {requirements && (
                        <p className="text requirements">Requirements: {requirements}</p>
                    )}
                    <p className="text">Professor: {professor_name}</p>
                    <div className="add_date">
                        <p className="text">{formatDate(date_start)}</p>
                        <p className="text">{formatDate(date_end)}</p>
                    </div>
                
                </>
            )}

            {viewType === "Applied" && (
                <>
                    <p className="text">Student: {student_name}</p>
                    <p className="text">Faculty: {faculty} {study_program && `(Program: ${study_program})`}</p>
                    <p className="text">appliedDate: {formatDate(applied_data)}</p>
                    <div class="button-container">
                        <button 
                            class="chose_btn" 
                            type="button" 
                            onClick={(e) => {
                            e.stopPropagation(); 
                            onAccept(); 
                            }}
                            >
                            Accept
                        </button>

                        <button   
                                class="chose_btn decline" 
                                type="button" 
                                onClick={(e) => {
                                e.stopPropagation(); 
                                onDecline(); 
                                }}
                                    >
                                Decline
                        </button>
                    </div>

                </>
            )}

            {viewType === "MyThesis" && (
                <>
                    <p className="text">Faculty: {faculty} {study_program && `(Program: ${study_program})`}</p>
                    
                    <p className="text description">Description: {description}</p>
                    <button 
                        className="withdraw_btn" 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onWithdraw(); 
                        }}
                    >
                        Withdraw Thesis
                    </button>
                    <div className="add_date">
                        <p className="text">{formatDate(date_start)}</p>
                        <p className="text">{formatDate(date_end)}</p>
                    </div>
                </>
            )}

            {viewType === "MyApplies" && (
                <>
                    <p className="text">Professor: {professor_name}</p>
                    <p className="text">Faculty: {faculty} {study_program && `(Program: ${study_program})`}</p>
                    <p className="text description">Description: {description}</p>
                    {requirements && (
                        <p className="text requirements">Requirements: {requirements}</p>
                    )}
                    <button 
                        className="chose_btn decline" 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onWithdrawApplication(); 
                        }}
                    >
                        Withdraw Application
                    </button>
                    <p className="text">appliedDate: {formatDate(applied_data)}</p>
                    
                </>
            )}
        </form>
    );
}
