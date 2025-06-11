import React, { useEffect, useState, useContext } from "react";

import "../page_css/ThesisInfo.css";
import { AppContext } from "../components/AppContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router-dom"; 
import BACKEND_URL from "../server_link";

export default function ThesisInfo_Admin() {
    // State to hold the thesis data fetched from backend
    const [thesisData, setThesisData] = useState(null);

    // React Router's navigation hook to programmatically navigate pages
    const navigate = useNavigate();

    // Get thesis_id from AppContext to identify which thesis to load
    const { thesis_id } = useContext(AppContext);

    // Effect runs on component mount or when thesis_id changes
    useEffect(() => {
        // Check if the user is admin by reading 'admin' key from localStorage
        const isAdmin = localStorage.getItem('admin');

        // If not an admin, redirect to login page
        if (isAdmin !== 'admin') {
            navigate("/login");
        } else {
            // If admin, fetch thesis data for the given thesis_id from backend
            fetch(`${BACKEND_URL}/thesis_admin?id=${thesis_id}`)
                .then((response) => response.json())
                .then((data) => {
                    // Set the fetched thesis data to state
                    setThesisData(data);
                })
                .catch((error) => {
                    // Log any errors while fetching
                    console.error("Error fetching theses:", error);
                });
        }
    }, [thesis_id, navigate]);

    // Helper function to format ISO date string into DD/MM/YYYY format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);

        // If date is invalid or equals epoch start, return empty string
        if (date.getTime() === 0) {
            return ''; 
        }

        // Extract day, month, and year with leading zeros
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // Return formatted date string
        return `${day}/${month}/${year}`;
    }

    // While thesis data is not yet fetched, display loading message
    if (!thesisData) return <p>Loading...</p>;

    // Handler to navigate back to the admin page
    const handleBack = () => {
        navigate("/Admin_Page");
    };

   

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
                        <p className="text_info">Start: {formatDate(thesisData.start_date)}</p>
                        <p className="text_info">End: {formatDate(thesisData.end_date)}</p>
                    </div>
                    <p className="faculty-name"><strong>Faculty:</strong> {thesisData.faculty}</p>
                    
                    <p className="description"><strong>Description:</strong> {thesisData.description}</p>
                    <p className="requirements"><strong>Requirements:</strong> {thesisData.requirements}</p>
                    
                </form>
                
                <form className="right-form">
                    <h2>Profesor Name: {thesisData.prof_name}</h2>
                 
                    <p className="text_info">Email: 
                        <a href={`mailto:${thesisData?.email}`} className="email-link">
                            {thesisData?.email}
                        </a>
                    </p>
                    <p></p>
                    <p className="text_info">Facultatea: {thesisData.faculty}</p>
                  
                  
                    
                </form>
            </div>
        </div>
    );
}
