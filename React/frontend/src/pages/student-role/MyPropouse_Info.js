import React from "react";
import { useNavigate } from "react-router";
import { useEffect,useContext,useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/student_role/MyPropouse_Info.css';
import { AppContext } from "../../components/AppContext";
import { Link } from "react-router-dom";


export default function MyPropouse_Info()
{

    const navigate = useNavigate();
    const [thesisData, setThesisData] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [theses, setTheses] = useState([]); 
    const { thesis_id,type} = useContext(AppContext); 
    const [studyYear, setStudyYear] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 


    useEffect(() => {
        const fetchData = async () => {
            if (!thesis_id) {
                console.warn("thesis_id is undefined or null, skipping fetch.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8081/MyPropouse/${thesis_id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch thesis data');
                }

                const data = await response.json();

                if (data.length > 0) {
                    setThesisData(data[0]); 
                } else {
                    console.warn("No data found for thesis_id:", thesis_id);
                }
            } catch (error) {
                console.error('Error fetching proposals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [thesis_id]);

    useEffect(() => {
        if (!thesisData?.stud_id) return;  
        const id = thesisData?.stud_id;
       
    
        const fetchStudyYear = async () => {
            try {
               
                const response = await fetch(`http://localhost:8081/student_info/${id}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch study year");
                }
    
                const data = await response.json();
               
    
                setStudyYear(data.study_year); 
              
            } catch (error) {
                console.error("Error fetching study year:", error);
            }
        };
    
        fetchStudyYear();
    }, [thesisData]);
    

    if (isLoading) {
        return <div>Loading...</div>;
    }
   

    const handleBack = () => {
        navigate("/prof");
    };

   


    function handlePropouse_Accepted(id) {
        console.log(`Accepting proposal with ID: ${id}`);
        fetch(`http://localhost:8081/proposalAcceptConfirm/${id}`, {
            method: "PATCH", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "accepted" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to accept thesis");
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "accepted" } : thesis
                )
            );
        })
        .catch(error => console.error("Error accepting thesis:", error));
       
        window.location.reload();
    }
    
    async function handlePropouse_reject(id) {
        console.log(`Rejecting proposal with ID: ${id}`);
        fetch(`http://localhost:8081/proposaReject/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: "rejected" }), 
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to reject thesis");
            setTheses(prevTheses =>
                prevTheses.map(thesis =>
                    thesis.id === id ? { ...thesis, state: "rejected" } : thesis
                )
            );
        })
        .catch(error => console.error("Error rejecting thesis:", error));
        navigate('/prof')
        window.location.reload();
    }
    


    
    async function handleAcceptStudent(thesisId,e) {
        e.preventDefault(); 
         try {
           const userInfo = JSON.parse(localStorage.getItem('userInfo'));
           const studentId = userInfo.id;
         
           
           if (!studentId) {
               console.error(" ID not found");
               return;
           }
           
           
           const acceptedApplicationData = {
               id_thesis: thesisData?.id,
               faculty:thesisData?.faculty,
               title:thesisData?.title,
               id_prof:thesisData?.prof_id,
               prof_name:thesisData?.prof_name,
               prof_email: 'propose',
               stud_id:thesisData?.stud_id,
               stud_email:thesisData?.stud_email,
               stud_name:thesisData?.stud_name,
               stud_program:thesisData?.study_program,
               date: new Date().toISOString().split('T')[0],
               origin:'propose'
           };
   
           console.log('acceptedApplicationData',acceptedApplicationData);
           
       
           const acceptResponse = await fetch("http://localhost:8081/acceptedApplications", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(acceptedApplicationData)
           });
   
           if (!acceptResponse.ok) {
               throw new Error("Failed to accept application");
           }
   
           console.log("Application accepted successfully:", acceptedApplicationData);
   
          
           handlePropouse_Accepted(thesisId);
           navigate('/prof')
       } catch (error) {
           console.error("Error in handleAcceptStudent:", error);
       }
   }

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
        <div className="body_thesisinfo">
            <div className="form-container">
                <form className="left-form">
                    <div className="header-container">
                        <button  className="back-button" onClick={handleBack}>
                            <ArrowBackIcon />
                        </button>
                        <h2 className="thesisName"><strong>Titlu:</strong> {thesisData?.title}</h2>
                    </div>
                    <div className="date">
                        <p className="in_date">Apply Date: {formatDate(thesisData?.date)}</p>
    
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {thesisData?.faculty}</p>
                    <p className="study-program"><strong>StudyProgram:</strong> {thesisData?.study_program}</p>
                    <p className="description"><strong>Description:</strong> {thesisData?.description}</p>
                    <p className="requirements"><strong>Motivation:</strong> {thesisData?.motivation}</p>
                    <div className="buton_gr">
                    {(type === "professor" || type === 1) && (
                            <>
                                <button className="accept-button"  onClick={(e) => {
                                e.stopPropagation(); 
                                handleAcceptStudent(thesisData?.id,e); 
                            }} >Accept</button>

                                <button className="decline-button" onClick={(e) => { 
                                e.stopPropagation(); 
                                handlePropouse_reject(thesisData?.id,e); 
                            }}>Decline</button>
                            </>
                    )}
                </div>
                </form>
                
                <form className="right-form">
                    <h2>Name:{thesisData?.stud_name}</h2>
                    <p>Email: 
                        <a href={`mailto:${thesisData?.stud_email}`} className="email-link">
                            {thesisData?.stud_email}
                        </a>
                    </p>
                    <p>Faculty: {thesisData?.faculty}</p>
                    <p>Study Program: {thesisData?.study_program}</p>
                    <p>Study year: {studyYear || 'null'}</p>

                    
                </form>
            </div>
        </div>
    );
}
