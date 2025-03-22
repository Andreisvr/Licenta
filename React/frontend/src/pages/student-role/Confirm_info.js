import React from "react";
import { useNavigate } from "react-router";
import { useEffect,useContext,useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import BACKEND_URL from "../../server_link";
import "../../page_css/MyPropouse_Info.css";

import { AppContext } from "../../components/AppContext";

export default function MyConfirm_info_stud()
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
                const response = await fetch(`${BACKEND_URL}/MyConfirm_Info/${thesis_id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch thesis data');
                }

                const data = await response.json();
                console.log('info',data);
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
               
                const response = await fetch(`${BACKEND_URL}/student_info/${id}`);
                
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
            <div className="form-container" >
                <form className="left-form">
                    <div className="header-container">
                        <button  className="back-button" onClick={handleBack} >
                            <ArrowBackIcon  />
                        </button>
                        <h2 className="thesisName" style={{ 
                            whiteSpace: 'normal', 
                            wordWrap: 'break-word', 
                            overflowY: 'auto', 
                            minHeight: '8vh', 
                            maxHeight: '20vh' 
                            }}>
                            <strong>Titlu:</strong> {thesisData?.title}
                            </h2>
                    </div>
                    <div className="date">
                        <p style={{ color: "#333" }} className="in_date">Start: {formatDate(thesisData?.start_date)}</p>
                        <p style={{ color: "#333" }} className="off_date">End: {formatDate(thesisData?.end_date)}</p>
                    </div>
                    <p style={{ color: "#333" }} className="faculty-name"><strong>Faculty:</strong> {thesisData?.faculty}</p>
                   
                    <p className="description" style={{ height: '55vh', overflow:'auto'}}><strong>Description:</strong> {thesisData?.description}</p>
                    <p className="requirements"><strong>Requirements:</strong> {thesisData?.requirements}</p>
                    <div className="buton_gr">
                   
                    
                </div>
               
               
                </form>
                
                <form className="right-form">
                    <h2 style={{ color: "#333" }} >Profesor Name:{thesisData?.prof_name}</h2>
                    <p style={{ color: "#333" }} >Profesor Email: 
                        <a href={`mailto:${thesisData?.email}`} className="email-link">
                            {thesisData?.email}
                        </a>
                    </p>
                    <p style={{ color: "#333" }}>Faculty: {thesisData?.faculty}</p>
                    <p style={{ color: "#333" }}>State: {thesisData?.state}</p>
                   
                </form>
            </div>
        </div>
    );
}
