import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/prof_cab.css';
import AddThesis from "./thesis_card.js";
import { AppContext } from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/AppContext.js';
import PersonIcon from '@mui/icons-material/Person'; 
import SchoolIcon from '@mui/icons-material/School'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Cabinet() {
    const { name, email, logined, type } = useContext(AppContext);
    const navigate = useNavigate();
    const [theses, setTheses] = useState([]); 
    const [allTheses, setAllTheses] = useState([]); 

    const handleClickThesis = (thesis) => {
        localStorage.setItem('selectedThesis', JSON.stringify(thesis));
        console.log('Teza acutala ', thesis);
    };

    useEffect(() => {
        fetch("http://localhost:8081/prof", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setTheses(data);
            setAllTheses(data); 
        })
        .catch((error) => {
            console.error("Error fetching theses:", error);
        });
    
        if (logined) {
            fetch("http://localhost:8081/prof", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            })
            .then((response) => response.json())
            .then((userInfo) => {
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                console.log('user infio', userInfo);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
            });
        }   
    }, [logined, email]);

    const handleClickAdd = () => {
        navigate('/add_form');
    };

    const handleAllClick_All = () => {
        setTheses(allTheses);
    };

    const handleSeeAplies = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo ? userInfo.id : null;
    
        if (!studentId) {
            console.error("Student ID not found");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8081/thesisinfo?id_stud=${studentId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch applied theses");
            }
    
            const appliedThesesData = await response.json();
            console.log("Applied Theses Data:", appliedThesesData);
          
            const matchedTheses = allTheses.filter(thesis =>
                appliedThesesData.some(applied => applied.id_thesis === thesis.id)
            );
           
            setTheses(matchedTheses);
        } catch (error) {
            console.error("Error fetching applied theses:", error);
        }
    };
    
    function handleWithdraw(id) {
        fetch(`http://localhost:8081/prof/${id}`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to withdraw thesis");
            }
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => {
            console.error("Error withdrawing thesis:", error);
        });
    }
    
    function handleShowMyThesis() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo ? userInfo.id : null; 

        const myTheses = allTheses.filter(thesis => thesis.prof_id === profId); 
        setTheses(myTheses);
    }

    const getShortDescription = (desc) => {
        if (!desc) return ""; 
        const shortDesc = desc.substring(0, 100);
        return shortDesc + (desc.length > 100 ? "..." : "");
    };
    
    return (
        <div className="body_prof">
            <div className="left_container"></div>
            <div className="right_container">
                <div className="top_container">
                    <div className="button-group">
                        {type === "professor" ? (
                            <>
                                <button onClick={handleAllClick_All}>ALL</button>
                                <button onClick={handleShowMyThesis}>MyThesis</button>
                                <button>Applied</button>
                                <button>Accepted</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleAllClick_All}>ALL</button>
                                <button>MyPropouse</button>
                                <button onClick={handleSeeAplies}>MyAplies</button>
                                <button>Responsed</button>
                            </>
                        )}
                    </div>
                    <div className="icon-container">
                        {type === "professor" ? <PersonIcon className="icon" /> : <SchoolIcon className="icon" />}
                    </div>
                </div>
                <div className="bottom_container">
                    {theses.map(thesis => (
                        <AddThesis 
                            key={thesis.id} 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleClickThesis(thesis); 
                                navigate('/thesisinfo'); 
                            }}
                            onWithdraw={() => handleWithdraw(thesis.id)} // Pass the withdraw function
                            thesisName={thesis.title}
                            number_of_aplies={thesis.number_of_applies} 
                            date_start={thesis.start_date}
                            date_end={thesis.end_date}
                            faculty={thesis.faculty}
                            study_program={thesis.study_program}
                            description={getShortDescription(thesis.description)}
                            requirements={getShortDescription(thesis.requirements)}
                            professor_name={thesis.prof_name}
                            isAll={theses === allTheses ? false : true}
                        />
                    ))}
                    {type === "professor" && (
                        <div className="add-button-container">
                            <AddCircleOutlineIcon onClick={handleClickAdd} className="add_button" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
