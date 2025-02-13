import React from "react";
import { useNavigate } from "react-router-dom"; 
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Type_Account.css';
import profesorGif from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/images/teach_12146114.gif';
import studentGif from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/images/student_12525336.gif';

function Type_account() {
    const navigate = useNavigate(); 

    const handleClickProf = () => {
        navigate('/reg', { state: { type: 'prof' } }); 
    };

    const handleClickStud = () => {
        navigate('/reg_stud', { state: { type: 'stud' } }); 
    };

    return (
        <div className="body_choose">
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h2>Choose your type of account</h2>
            <div className="types">
                <div className="profesor" onClick={handleClickProf}>
                    <p>Profesor</p>
                    <img src={profesorGif} alt="Profesor GIF" />
                </div>

                <div className="student" onClick={handleClickStud}>
                    <p>Student</p>
                    <img src={studentGif} alt="Student GIF" />
                </div>
            </div>
        </div>
    );
}

export default Type_account;
