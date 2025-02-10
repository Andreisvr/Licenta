import React, { useEffect, useState } from "react";

export default function MyConfirmed({ id_thesis, origin }) {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8081/ConfirmInformation/${id_thesis}?origin=${origin}`, {
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

    if (loading) {
        return <p>Loading...</p>; 
    }

    if (error) {
        return <p>Error: {error}</p>; 
    }

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 50)}${desc.length > 100 ? "..." : ""}` : "");


    return (
        <form className="applied_form">
             <p className="text title">Title: {getShortDescription(data.title) || "No title"}</p>
           
            <p className="text">Description: {getShortDescription(data.description) || "No description"}</p>
          
            <p className="text">Professor: {data.prof_name || "No professor name"}</p>
         
            <p className="text">Date: {data.date ? formatDate(data.date) : "No date"}</p>
        </form>
    );
}

