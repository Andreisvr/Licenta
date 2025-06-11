
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../components/AppContext";
import BACKEND_URL from "../../server_link";

export default function MyConfirmed({ id_thesis, origin ,id_stud,date }) {

    // State to hold fetched thesis data
    const [data, setData] = useState(null); 

    // State to handle loading status
    const [loading, setLoading] = useState(true);

    // State to handle any error messages
    const [error, setError] = useState(null);

    // State to store student information
    const [student, setStudent] = useState(null);

    // Navigation hook to programmatically navigate to other routes
    const navigate = useNavigate();

    // Access context functions to update selected student and thesis IDs
    const { handleStud_id, handleThesisId } = useContext(AppContext);

    // Fetch thesis and student data when the component mounts or when id_thesis/origin changes
    useEffect(() => {
        // Fetch student confirmation information
        fetch(`${BACKEND_URL}/ConfirmInformation_Student/${id_stud}?origin=${origin}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // If data is received, store it in student state
                if (Array.isArray(data) && data.length > 0) {
                    setStudent(data);
                } else {
                    setError("No data available");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            });

        // Fetch thesis confirmation information
        fetch(`${BACKEND_URL}/ConfirmInformation/${id_thesis}?origin=${origin}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // If data is received, store the first entry in data state
                if (Array.isArray(data) && data.length > 0) {
                    setData(data[0]); 
                } else {
                    setError("No data available");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [id_thesis, origin]);

    // Display loading message while data is being fetched
    if (loading) {
        return <p>Loading...</p>; 
    }

    // Display error message if any error occurred during fetch
    if (error) {
        return <p>Error: {error}</p>; 
    }

    // Utility function to format ISO date string to DD/MM/YYYY
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Utility function to return a shortened version of a description
    const getShortDescription = (desc) => {
        if (desc && desc !== 'null') {
            return `${desc.substring(0, 254)}${desc.length > 100 ? "..." : ""}`;
        }
        return "";
    };

    // Handle navigation to chat page with selected thesis and student IDs
    function go_chat() {
        handleThesisId(id_thesis);
        handleStud_id(id_stud);
        navigate('/Prof_Chat');
    }


    

    return (
        <form className="applied_form" onClick={go_chat}>
                <p className="text title">Title: {getShortDescription(data?.title) || "No title"}</p>

                {Array.isArray(student) && student.length > 0 ? (
                    student.map((stud, index) => (
                        <div key={index}>
                            <p className="text">Student Name: {stud.name || "No name"}</p>
                            <p className="text">Email: {stud.email || "No email"}</p>
                            <p className="text">Program Study: {stud.ProgramStudy || "No data"}</p>
                            <p className="text">Study Year: {stud.study_year || "No data"}</p>
                          
                        </div>
                    ))
                ) : (
                    <p className="text">No students found</p>
                )}

                <p className="text">Origin: {origin || "No origin"}</p>
                <p className="text">Date: {date ? formatDate(date) : "No date"}</p>
            </form>

    );
}

