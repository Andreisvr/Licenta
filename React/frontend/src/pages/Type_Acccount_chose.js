import React from "react";
import { useNavigate } from "react-router-dom"; 

import   "../page_css/Type_Account.css";
import  profesorGif from "../images/teach_12146114.gif";
// import  profesorGif from "../images/tom-and-jerry-nibbles.gif";

import studentGif from "../images/student_12525336.gif";
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
           
          
           <h2 className="text_choose">Choose your type of account</h2>

            <div className="types">
                <div className="profesor" onClick={handleClickProf}>
                    <h2>Professor</h2>
                    <p>Profesor</p>
                    <img src={profesorGif} alt="Profesor GIF" />
                </div>

                <div className="student" onClick={handleClickStud}>
                <h2>Student</h2>
                    <p>Student</p>
                    <img src={studentGif} alt="Student GIF" />
                </div>
            </div>
        </div>
    );
}

export default Type_account;
