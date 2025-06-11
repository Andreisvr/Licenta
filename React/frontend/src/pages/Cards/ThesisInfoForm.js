import React, { useEffect, useState, useContext } from "react";

import "../../page_css/ThesisInfo.css";
import { AppContext } from "../../components/AppContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router-dom"; 
import BACKEND_URL from "../../server_link";

export default function ThesisInfo() {
    // State to store the thesis details loaded from localStorage
    const [thesisData, setThesisData] = useState(null);
    // Get the user type (professor/student) from global AppContext
    const { type } = useContext(AppContext);
    // State to track if the thesis is marked as favorite by the user
    const [clicked, setClicked] = useState(false);
    // State to store user info loaded from localStorage
    const [userInfo, setUserInfo] = useState(null);
    // State to track if the user already applied to this thesis
    const [applied, setApplied] = useState(false);
    // Hook to programmatically navigate between routes
    const navigate = useNavigate(); 
    // State to control the visibility of the application form
    const [showForm, setShowForm] = useState(false);
    // State to store the user's input for the cover letter
    const [coverLetter, setCoverLetter] = useState("");
    
    // On component mount, load thesis data and user info from localStorage
    useEffect(() => {
        const savedThesis = localStorage.getItem('selectedThesis');
        const userinfo = localStorage.getItem('userInfo');
        
        if (savedThesis) {
            // Parse and set the selected thesis details
            setThesisData(JSON.parse(savedThesis));
        }
    
        if (userinfo) {
            // Parse and set the logged-in user's information
            const parsedUserInfo = JSON.parse(userinfo);
            setUserInfo(parsedUserInfo);
        }
    }, []);

    // When userInfo or thesisData changes, check if thesis is in user's favorites
    useEffect(() => {
        if (!userInfo || !thesisData) return;
    
        // Async function to check if thesis is marked as favorite by user
        const checkFavorite = async () => {
            try {
                // Send GET request to backend to check favorite status
                const response = await fetch(
                    `${BACKEND_URL}/check?userId=${userInfo.id}&thesisId=${thesisData.id}`, 
                    {
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const result = await response.json();
                // Update clicked state based on backend response
                setClicked(result.isFavorite);  
            } catch (error) {
                console.error('Eroare în timpul verificării favoritei:', error);
            }
        };
    
        checkFavorite();
    }, [userInfo, thesisData]);
    
    // When user clicks the "Apply" button, show the application form
    const handleApplyClick = () => {
        setShowForm(true); 
    };
    
    // Handle submitting the application form
    const handleSubmitApply = async () => {
        // If a cover letter is required but too short, show alert and stop
        if (thesisData.isRequiredLetter && coverLetter.length < 10) {
            alert("Scrisoarea de intenție trebuie să aibă cel puțin 10 caractere!");
            return;
        }

        // Prepare the application data to send to backend
        const appliedData = {
            title: thesisData.title,
            id_thesis: thesisData.id,
            id_prof: thesisData.prof_id,
            prof_name: thesisData.prof_name,
            id_stud: userInfo.id,
            stud_name: userInfo.name,
            faculty: thesisData.faculty,
            student_program: userInfo.ProgramStudy,
            stud_email: userInfo.email,
            prof_email: thesisData.email,
            applied_data: new Date().toISOString(),
            year: userInfo.study_year,
            coverLetter: coverLetter 
        };
        console.log('Application data:', appliedData);
       
        // Double-check for cover letter requirement and length before submitting
        if (thesisData.isLetterRequired && coverLetter.length < 10) {
            alert("Scrisoarea de intenție trebuie să aibă cel puțin 10 caractere!");
            return;
        }
        console.log(thesisData.isRequiredLetter, coverLetter.length);
        
        try {
            // Send POST request to backend with application data
            const response = await fetch(`${BACKEND_URL}/thesisinfo`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appliedData),
            });
    
            // Handle specific 400 error response from backend
            if (response.status === 400) {
                const errorResponse = await response.json();
                alert(errorResponse.error); 
                setApplied(true);
                return; 
            }
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Parse success result and update applied state
            const result = await response.json();
            console.log('Application submitted:', result);
            setApplied(true);
    
        } catch (error) {
            console.error('Error applying:', error);
        }
    }

    // Helper function to format ISO date string to dd/mm/yyyy format
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

    // Show loading text until thesis data is loaded
    if (!thesisData) return <p>Loading...</p>;

    // Handle favorite/unfavorite click on the thesis
    const handleClick = async() => {
        // Toggle the clicked state
        setClicked(!clicked);
    
        if (!clicked) {
            // If not previously favorite, add to favorites in backend
            try {
                const response = await fetch(`${BACKEND_URL}/fav`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userInfo.id,
                        thesisId: thesisData.id,
                    }),
                });
            
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            
                const result = await response.json();
                console.log('Added to favorites:', result);
            } catch (error) {
                console.error('Eroare în timpul adăugării la favorite:', error);
            }
        } else {
            // If already favorite, remove from favorites in backend
            try {
                const response = await fetch(`${BACKEND_URL}/fav`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userInfo.id,
                        thesisId: thesisData.id,
                    }),
                });
            
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            
                const result = await response.json();
                console.log('Removed from favorites:', result);
            } catch (error) {
                console.error('Eroare în timpul ștergerii din favorite:', error);
            }
        }
    };
    
    // Handle back button click: navigate to /prof route
    const handleBack = () => {
        navigate("/prof");
    };

    // Hide the application form
    function hideForm(){
        setShowForm(false);
    }



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
                        <p className="in_date">{formatDate(thesisData.start_date)}</p>
                        <p className="off_date">{formatDate(thesisData.end_date)}</p>
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {thesisData.faculty}</p>
                    
                    <p className="description"><strong>Description:</strong> {thesisData.description}</p>
                    <p className="requirements"><strong>Requirements:</strong> {thesisData.requirements}</p>
                    <div className="apply-status-favorite-container">
                        {(type === "student" || type === 0 )&&(userInfo.thesis_confirmed == 0) && (
                            <button type="button" className="apply-button" onClick={handleApplyClick} disabled={applied}>
                                {applied ? 'Applied' : 'Apply'}
                            </button>
                        )}

                        {showForm && !applied && (
                        <div className="cover-letter-form">
                            <textarea 
                                value={coverLetter} 
                                onChange={(e) => setCoverLetter(e.target.value)} 
                                placeholder="Cover Letter."
                                className="cover-letter-input"
                            />
                            <button 
                                type="button" 
                                className="apply-button" 
                                onClick={handleSubmitApply}
                                disabled={thesisData?.isRequiredLetter && coverLetter.length < 10}
                            >
                                Submit Application
                            </button>
                            <button  className="apply-button-back" onClick={ hideForm} >back</button>
                        </div>
                    )}

                    {applied && <p className="applied-message">You have already applied.</p>}

                        {/* <span className={`status ${clicked ? "status-open" : "status-closed"}`}>
                            {thesisData.state}
                        </span> */}
                        <button className="favorite-button" onClick={handleClick}>
                            {clicked ? (
                                <FavoriteIcon fontSize="large" className="icon-clicked" />
                            ) : (
                                <FavoriteBorderIcon fontSize="large" className="icon-border" />
                            )}
                        </button>
                    </div>
                </form>
                
                <form className="right-form">
                    <h2 style={{ color: "#333" }}>Professor Name: {thesisData.prof_name}</h2>
                 
                    <p style={{ color: "#333" }}>Email: 
                        <a href={`mailto:${thesisData?.email}`} className="email-link">
                            {thesisData?.email}
                        </a>
                    </p>
                    <p style={{ color: "#333" }}>Facultatea: {thesisData.faculty}</p>
                  
                  
                    
                </form>
            </div>
        </div>
    );
}
