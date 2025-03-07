import React,{ useState } from "react";

import "../page_css/Thesis_box.css"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router";

export default function ThesisBox({ thesisName, professorName, facultyName, studyProgram, description, startDate, endDate, proposalStatus })     {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/thesisinfo'); 
    };
    
    
    const truncateText = (text, limit) => {
        if (!text) return ''; 
        const words = text.split(' ');
        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...';
        }
        return text;
    };

    
    const [clicked, setClicked] = useState(false); 

    const handleClick = () => {
        setClicked(!clicked); 
    };


    const renderCircles = () => {
        return (
            <div className="circles-container">
                <div className={`circle ${proposalStatus === 'without' || proposalStatus === 'proposed' || proposalStatus === 'blocked' ? 'filled green' : ''}`}></div>
                <div className={`circle ${proposalStatus === 'proposed' || proposalStatus === 'blocked' ? 'filled yellow' : ''}`}></div>
                <div className={`circle ${proposalStatus === 'blocked' ? 'filled red' : ''}`}></div>
            </div>
        );
    };

    return (
        <div className="option">
            <div className="option-left">
                <h2>{truncateText(thesisName, 25)}</h2>
                <div className="prof-data">
                    <span>{truncateText(professorName, 10)}</span>
                    <span>{startDate} - {endDate}</span>
                </div>
                <p className="faculty-name">{truncateText(facultyName, 25)}</p> 
                <p className="study-program">{truncateText(studyProgram, 25)}</p>
                
                <p className="thesis-description" onClick={handleViewClick}>
                {truncateText(description, 40)}  <a href="/thesisinfo">View</a>
                </p>
            </div>

            <div className="option-right">

            <button className="favorite-button" onClick={handleClick}>
                    {clicked ? (
                        <FavoriteIcon fontSize="large" className="icon-clicked" />
                    ) : (
                        <FavoriteBorderIcon fontSize="large" className="icon-border" />
                    )}
                </button>

                {renderCircles()}
                <p className="proposal-status">{proposalStatus}</p>
            </div>
        </div>
    );
}
