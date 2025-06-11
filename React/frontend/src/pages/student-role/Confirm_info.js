import React from "react";
import { useNavigate } from "react-router";
import { useEffect,useContext,useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import BACKEND_URL from "../../server_link";
import "../../page_css/MyPropouse_Info.css";

import { AppContext } from "../../components/AppContext";

// Component to display confirmation info about a student's thesis proposal
export default function MyConfirm_info_stud() {

    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    // State to store thesis data fetched from backend
    const [thesisData, setThesisData] = useState(null);

    // State to store user information (currently unused here but declared)
    const [userInfo, setUserInfo] = useState(null);

    // State to store a list of theses (declared but unused in the snippet)
    const [theses, setTheses] = useState([]); 

    // Extract thesis_id and user type from app-wide context
    const { thesis_id, type } = useContext(AppContext);

    // State to store the student's study year fetched separately
    const [studyYear, setStudyYear] = useState([]);

    // Loading state to show a loading indicator while fetching data
    const [isLoading, setIsLoading] = useState(true); 

    // Effect to fetch thesis info once thesis_id is available or changes
    useEffect(() => {
        const fetchData = async () => {
            if (!thesis_id) {
                console.warn("thesis_id is undefined or null, skipping fetch.");
                return;  // Exit early if no thesis_id is present
            }

            try {
                // Fetch thesis confirmation info from backend API
                const response = await fetch(`${BACKEND_URL}/MyConfirm_Info/${thesis_id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch thesis data');
                }

                const data = await response.json();
                console.log('info', data,thesis_id);

                // If data is returned, set the first thesis object into state
                if (data.length > 0) {
                    setThesisData(data[0]); 
                } else {
                    console.warn("No data found for thesis_id:", thesis_id);
                }
            } catch (error) {
                // Log any error encountered during fetching
                console.error('Error fetching proposals:', error);
            } finally {
                // Regardless of success or failure, stop loading spinner
                setIsLoading(false);
            }
        };

        fetchData();
    }, [thesis_id]);

    // Effect to fetch the study year of the student once thesisData is available
    useEffect(() => {
        // If no student id is found in thesis data, do nothing
        if (!thesisData?.stud_id) return;  
        const id = thesisData.stud_id;

        const fetchStudyYear = async () => {
            try {
                // Fetch student info, including study year, from backend API
                const response = await fetch(`${BACKEND_URL}/student_info/${id}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch study year");
                }

                const data = await response.json();

                // Update state with the student's study year
                setStudyYear(data.study_year); 
              
            } catch (error) {
                // Log any errors while fetching study year
                console.error("Error fetching study year:", error);
            }
        };
    
        fetchStudyYear();
    }, [thesisData]);

    // While data is loading, show a loading indicator
    if (isLoading) {
        return <div>Loading...</div>;
    }
   
    // Function to navigate back to the professor's page
    const handleBack = () => {
       navigate("/prof");
    };

    // Utility function to format ISO date strings into "dd/mm/yyyy" format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);

        // If the date is invalid or epoch time 0, return empty string
        if (date.getTime() === 0) {
            return ''; 
        }

        // Pad day and month with leading zeros if needed
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
