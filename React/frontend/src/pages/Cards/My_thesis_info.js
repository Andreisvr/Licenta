import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import BACKEND_URL from "../../server_link";
import "../../page_css/My_thesis_info.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

import { AppContext } from "../../components/AppContext";

export default function ThesisModify() {
  
  // State to hold thesis data fetched from the backend
  const [thesisData, setThesisData] = useState(null);

  // Access the thesis ID from AppContext
  const { thesis_id } = useContext(AppContext); 

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
 
  // useEffect to fetch thesis data when component mounts or when thesis_id changes
  useEffect(() => {
    console.log('Fetching thesis data for ID:', thesis_id);
    const fetchData = async () => {
        if (thesis_id) {
            try {
                const response = await fetch(`${BACKEND_URL}/thesis/${thesis_id}`);
                
                // Check if the response is not successful
                if (!response.ok) {
                    throw new Error('Failed to fetch thesis data');
                }

                // Parse the JSON response
                const data = await response.json();
               
                // Update state with the fetched data
                setThesisData(data[0]);

            } catch (error) {
                console.error('Error fetching proposals:', error);
            }
        }
    };

    fetchData();
  }, [thesis_id]);

  // Handle changes to input fields and update thesis data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setThesisData((prevData) => {
        const updatedData = {
            ...prevData,
            [name]: name === "limit" ? parseInt(value, 10) || 0 : value, // Ensure limit is a number
        };
        return updatedData;
    });
  };

  // Handle form submission and send updated data to the backend
  const handleApply = (e) => {
        e.preventDefault();  

        // Prepare the data with formatted dates before sending
        const formattedData = {
          ...thesisData,
          start_date: thesisData.start_date ? formatDate(thesisData.start_date) : null,
          end_date: thesisData.end_date ? formatDate(thesisData.end_date) : null,
      };

        console.log('data modfiy',formattedData);

        // Send PATCH request to update thesis
        fetch(`${BACKEND_URL}/update_thesis/${thesis_id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
        })
        .then((response) => {
          if (response.ok) {
            console.log("Data updated successfully");
          } else {
            console.error("Error updating thesis");
          }
        })
        .catch((error) => console.error("Error:", error));

        // Navigate back to professor dashboard after update
        navigate('/prof');
  };

  // Navigate back without applying changes
  const handleBack = () => {
    navigate("/prof");
  };

  // Display loading message while data is being fetched
  if (!thesisData) {
    return <div>Loading thesis information...</div>;
  }

  // Format date string to 'yyyy-mm-dd' format for input fields
  const formatDate = (dateString) => {
    if (!dateString) return ""; 
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; 
    return date.toISOString().split("T")[0]; 
  };


  
  
  return (
    <div className="th_info_body">
    
      <form className="left_form">
      <button type="button" className="back-button" onClick={handleBack}>
                            <ArrowBackIcon />
                        </button>
        <label className="label_modify">
          Title:
          <input className="input_modify"
            type="text"
            name="title"
            value={thesisData.title || ""}
            onChange={handleChange}
          />
        </label>
        <label  className="label_modify">
          Description:
          <textarea className="textarea_modify"
            name="description"
            value={thesisData.description || ""}
            onChange={handleChange}
          />
        </label>
        <div></div>
        <label className="label_modify">
          Requirements:
          <textarea className="text_req"
            name="requirements"
            value={thesisData.requirements || ""}
            onChange={handleChange}
          />
        </label>
        <button className="button_gr" onClick={handleApply}>
        Modify
        </button>
      </form>

      <form className="right_form">
        <label className="label_modify">
          Limit:
          <input className="input_modify"
            type="number"
            name="limita"
            value={thesisData.limita || ""}
            onChange={handleChange}
          />
        </label>
        <label className="label_modify">
          Date From:
          <input className="input_modify"
            type="date"
            name="start_date"
            value={formatDate(thesisData.start_date) || ""}
            onChange={handleChange}
          />
        </label>
        <label className="label_modify">
          Date To:
          <input className="input_modify"
            type="date"
            name="end_date"
            value={formatDate(thesisData.end_date) || ""}
            onChange={handleChange}
          />
        </label>
       
      </form>
    </div>
  );
}
