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
    const [allAplies, setAllAplies] = useState([]);
    const [viewType, setViewType] = useState("ALL");
    const [acceptedResponses, setAcceptedResponses] = useState([]);


    const handleClickThesis = (thesis) => {
        localStorage.setItem('selectedThesis', JSON.stringify(thesis));
        console.log('Teza actuală ', thesis);
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
                console.log('user info', userInfo);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
            });
            //ALll Aplication

            fetch("http://localhost:8081/applies", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setAllAplies(data); 
                console.log("All Applications Data:", data);
            })
            .catch((error) => {
                console.error("Error fetching applications:", error);
            });
        }

       
        
    }, [logined, email]);

    const handleClickAdd = () => {
        navigate('/add_form');
    };

    const handleAllClick_All = () => {
        setTheses(allTheses);
        setViewType("ALL");
    };

    const handleSeeAplies = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo ? userInfo.id : null;

        if (!studentId) {
            console.error("Student ID not found");
            return;
        }

        
        const matchedTheses = allTheses.filter(thesis =>
            allAplies.some(applied => applied.id_thesis === thesis.id && applied.id_stud === studentId)
        );
        console.log(matchedTheses);
        setTheses(matchedTheses); 
        setViewType("MyApplies");
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

        window.location.reload();
       
        
    }
    

    function handleShowMyThesis() {
    
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo ? userInfo.id : null; 

        const myTheses = allTheses.filter(thesis => thesis.prof_id === profId); 
        setTheses(myTheses);
        setViewType("MyThesis");
    }
    
    function handleShowApplied() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo ? userInfo.id : null;
       
        console.log('user id:', profId);
        
        if (!profId) {
            console.error("Professor ID not found");
            return;
        }
    
        
        const appliedTheses = allAplies.filter(application => application.id_prof === profId);
        
        console.log('Filtered Applied Theses:', appliedTheses);
        setTheses(appliedTheses);
        setViewType("Applied");
    }



    function handleAplication_delet(id) {
        
        fetch(`http://localhost:8081/accept/${id}`, { 
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

        window.location.reload();
       
        
    }



    function handleAcceptStudent(thesisId) {
     
        const matchedApplication = allAplies.find(application => application.id === thesisId);
        
        if (!matchedApplication) {
            console.error("No matching application found for thesis id:", thesisId);
            return;
        }
    
       
        const acceptedApplicationData = {
            id_thesis: matchedApplication.id_thesis,
            faculty: matchedApplication.faculty,
            title: matchedApplication.title,
            id_prof: matchedApplication.id_prof,
            prof_name: matchedApplication.prof_name,
            prof_email: matchedApplication.prof_email,
            stud_id: matchedApplication.id_stud,
            stud_email: matchedApplication.stud_email,
            stud_name: matchedApplication.stud_name,
            stud_program: matchedApplication.student_program,
            date: new Date().toISOString().split('T')[0] 
        };
        console.log(acceptedApplicationData);
        
        fetch("http://localhost:8081/acceptedApplications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(acceptedApplicationData),
        }) 
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to accept application");
            }
            
            console.log("Application accepted successfully:", acceptedApplicationData);
            handleAplication_delet(thesisId)
            
        })
        .catch(error => {
            console.error("Error accepting application:", error);
        });
    }


   function handleMyAplication_delet(id){

     
    fetch(`http://localhost:8081/delMyAplication/${id}`, { 
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


    window.location.reload();
   

    }
  
    const handleSeeResponses = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo ? userInfo.id : null;

        if (!studentId) {
            console.error("Student ID not found");
            return;
        }

        fetch("http://localhost:8081/AcceptedApplication", {
            
            method: "GET",
             headers:  { "Content-Type": "application/json" } })
            
            .then((response) => response.json())
            .then((data) => {
                const matchedResponses = data.filter(response => response.stud_id === studentId);
                setAcceptedResponses(matchedResponses);
                setTheses(matchedResponses); 
                //setViewType("Responsed");
                console.log('dsd',data);
            })
            .catch((error) => console.error("Error fetching accepted applications:", error));
    };
   


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
                                <button onClick={handleShowApplied}>Applied</button>
                                <button>Accepted</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleAllClick_All}>ALL</button>
                                <button>MyPropouse</button>
                                <button onClick={handleSeeAplies}>MyAplies</button>
                                <button onClick={handleSeeResponses}>Responsed</button>
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
                            handleAcceptStudent(thesis.id) ;
                            handleAplication_delet(thesis.id);
                            handleMyAplication_delet(thesis.id);
                        }}
                        onWithdraw={() => handleWithdraw(thesis.id)} 
                        onAccept={()=> handleAcceptStudent(thesis.id)}
                        onDecline={()=>handleAplication_delet(thesis.id)}
                        onWithdrawApplication={()=>handleMyAplication_delet(thesis.id)}
                        thesisName={thesis.title}
                        date_start={thesis.start_date}
                        date_end={thesis.end_date}
                        faculty={thesis.faculty}
                        study_program={thesis.study_program}
                        description={getShortDescription(thesis.description)}
                        requirements={getShortDescription(thesis.requirements)}
                        professor_name={thesis.prof_name}
                        isAll={theses === allTheses ? false : true}
                        viewType={viewType} 
                        applied_date={viewType === "Applied" || viewType === "MyApplies" ? thesis.applied_date : undefined}
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
