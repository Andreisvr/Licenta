import React, { useEffect, useState, useContext } from "react";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/ThesisInfo.css';
import { AppContext } from "../../components/AppContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

export default function ThesisInfo() {
    const [thesisData, setThesisData] = useState(null);
    const {  type } = useContext(AppContext);
    const [clicked, setClicked] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [applied, setApplied] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const savedThesis = localStorage.getItem('selectedThesis');
        const userinfo = localStorage.getItem('userInfo');
    
        if (savedThesis) {
            setThesisData(JSON.parse(savedThesis));
        }
    
        if (userinfo) {
            const parsedUserInfo = JSON.parse(userinfo);
            setUserInfo(parsedUserInfo);
            //console.log('User Info:', parsedUserInfo); 
        }
    }, []);

    useEffect(() => {
        if (!userInfo || !thesisData) return;
    
       
        const checkFavorite = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8081/check?userId=${userInfo.id}&thesisId=${thesisData.id}`, 
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
               // console.log('eezultatul:', result);
    
                
                setClicked(result.isFavorite);  
            } catch (error) {
                console.error('Eroare în timpul verificării favoritei:', error);
            }
        };
    
        checkFavorite();
    }, [userInfo, thesisData]);
    

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

    const handleClick = async() => {
        setClicked(!clicked);
    
        if (!clicked) {

            try {
                const response = await fetch('http://localhost:8081/fav', {
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
                console.log('rez:', result);
            } catch (error) {
                console.error('Eroare în timpul adăugării la favorite:', error);
            }

        } else {
            try {
                const response = await fetch('http://localhost:8081/fav', {
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
                console.log('Șters cu succes din favorite:', result);
            } catch (error) {
                console.error('Eroare în timpul ștergerii din favorite:', error);
            }
        }
    };
    
    const handleBack = () => {
        navigate("/prof");
    };

    const handleApply = async () => {
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
            applied_data: new Date().toISOString() 
        };
        console.log(appliedData);
       

        try {
            const response = await fetch('http://localhost:8081/thesisinfo', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appliedData),
            });
    
            if (response.status === 400) {
                const errorResponse = await response.json();
                alert(errorResponse.error); 
                setApplied(true);
                return; 
            }
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Application submitted:', result);
            setApplied(true);
    
        } catch (error) {
            console.error('Error applying:', error);
        }
    };

    return (
        <div className="body_thesisinfo">
            <div className="form-container">
                <form className="left-form">
                    <div className="header-container">
                        <button type="button" className="back-button" onClick={handleBack}>
                            <ArrowBackIcon />
                        </button>
                        <h2 className="thesisName"><strong>Titlu:</strong> {thesisData.title}</h2>
                    </div>
                    <div className="date">
                        <p className="in_date">{formatDate(thesisData.start_date)}</p>
                        <p className="off_date">{formatDate(thesisData.end_date)}</p>
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {thesisData.faculty}</p>
                    <p className="study-program"><strong>ProgramStudy:</strong> {thesisData.study_program}</p>
                    <p className="description"><strong>Description:</strong> {thesisData.description}</p>
                    <p className="requirements"><strong>Requirements:</strong> {thesisData.requirements}</p>
                    <div className="apply-status-favorite-container">
                        {(type === "student" || type === 0) && (
                            <button type="button" className="apply-button" onClick={handleApply} disabled={applied}>
                                {applied ? 'Applied' : 'Apply'}
                            </button>
                        )}
                        <span className={`status ${clicked ? "status-open" : "status-closed"}`}>
                            {thesisData.state}
                        </span>
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
                    <h2>Name: {thesisData.prof_name}</h2>
                 
                    <p>Email: 
                        <a href={`mailto:${thesisData?.email}`} className="email-link">
                            {thesisData?.email}
                        </a>
                    </p>
                    <p>Facultatea: {thesisData.faculty}</p>
                  
                    <Link>CV: {userInfo && userInfo.cv_link ? 'Available' : 'Not Available'}</Link>

                    
                </form>
            </div>
        </div>
    );
}
