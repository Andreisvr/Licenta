import React from "react";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/ThesisInfo.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Footer from "./footer";

export default function ThesisInfo({ thesisName, facultyName, studyProgram, professorName, professorEmail }) {
    return (
        <div className="body_thesisinfo">
            <div className="form-container">

                <form className="left-form">
                    <h2 className="thesisName">{"Povesti cu Zmǎu"}</h2>
                    
                    <div className="date">
                    <p className="in_date">{"20/10/2024"}</p>
                    <p className="off_date">{"32/10/2024"}</p>
                    </div>
                    <p className="faculty-name">{"Faculty Name"}</p>
                    <p className="study-program">{"Study Program"}</p>
                    <p placeholder="Description" className="description" >{"PWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistentddldsmskskly positioned. If you still experience issues, ensure there are no external CSS rules affecting the layout PWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistently positioned. If you still experience issues, ensure there are no external CSS rules affecting the layoutPWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistently positioned. If you still experience issues, ensure there are no external CSS rules affecting the layoutPWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistently positioned. If you still experience issues, ensure there are no external CSS rules affecting the layoutPWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistently positioned. If you still experience issues, ensure there are no external CSS rules affecting the layoutPWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistently positioned. If you still experience issues, ensure there are no external CSS rules affecting the layoutPWith these adjustments, all the text elements in the left column should align at the top and maintain their intended positions without moving down. This should give you the desired layout where all text is consistently positioned. If you still experience issues, ensure there are no external CSS rules affecting the layout "}</p>
                    <div className="apply-favorite-container">
                        <button type="submit" className="apply-button">Apply</button>
                        <FavoriteBorderIcon fontSize="large" className="add_favorite" />
                    </div>
                </form>
               
                <form className="right-form">
                    <h2>{"Professor Name"}</h2>
                    <p>Email: {"professorEmail"}</p>
                    <p>Facultatea: {"facultyName"}</p>
                    <textarea placeholder="Mesaj opțional..." className="optional-message" />
                    <button type="submit" className="send-button">Send</button>
                </form>
            </div>
            <Footer/>
        </div>
       
    );
}
