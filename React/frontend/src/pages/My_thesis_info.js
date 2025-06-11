import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import "../page_css/My_thesis_info.css";
import BACKEND_URL from "../server_link";

import { AppContext } from "../components/AppContext";

import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

export default function ThesisModify_Admin() {
  
  const [thesisData, setThesisData] = useState(null);
  const { thesis_id, } = useContext(AppContext);

  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if 'admin' key in localStorage equals 'admin' (meaning user is an admin)
    const isAdmin = localStorage.getItem('admin');
    
    // If not admin, redirect user to the login page
    if (isAdmin !== 'admin') {
      navigate("/login"); 
    } else {
      // If user is admin, fetch thesis data from backend if thesis_id exists
      const fetchData = async () => {
        if (thesis_id) {
          try {
            // Fetch thesis data by thesis_id from backend
            const response = await fetch(`${BACKEND_URL}/thesis/${thesis_id}`);
  
            // If response is not OK, throw error to catch block
            if (!response.ok) {
              throw new Error('Failed to fetch thesis data');
            }
  
            // Parse JSON response
            const data = await response.json();
  
            // Set the fetched thesis data to state (assuming setThesisData is defined)
            setThesisData(data[0]);
  
          } catch (error) {
            // Log any errors during fetch
            console.error('Error fetching proposals:', error);
          }
        }
      };
  
      fetchData();
    }
    // Re-run effect whenever thesis_id changes
  }, [thesis_id]);
  
  // Handler for input changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update the thesisData state with the changed input
    setThesisData((prevData) => {
      const updatedData = {
        ...prevData,
        // If the input field is "limit", parse the value to integer, otherwise use string value
        [name]: name === "limit" ? parseInt(value, 10) || 0 : value,
      };
      return updatedData;
    });
  };
  
  // Handler for 'Back' button click: navigate back to Admin page
  const handleBack = () => {
    navigate("/Admin_Page");
  };
  
  // Handler for form submission to update thesis data
  const handleApply = (e) => {
    e.preventDefault();  
  
    // Format date fields before sending data to backend
    const formattedData = {
      ...thesisData,
      start_date: thesisData.start_date ? formatDate(thesisData.start_date) : null,
      end_date: thesisData.end_date ? formatDate(thesisData.end_date) : null,
    };
  
    console.log('data modify', formattedData);
  
    // Send PATCH request to update thesis info in backend
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
  
    // Navigate back to Admin page after update
    navigate('/Admin_Page');
  };
  
  // Show loading message if thesis data is not yet fetched
  if (!thesisData) {
    return <div>Loading thesis information...</div>;
  }
  
  // Utility function to format date string into YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty string if no date provided
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if invalid date
    return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD part of ISO string
  };
  
  return (
    <div className="th_info_body">
      
      <form className="left_form">
      <button  className="back-button" onClick={handleBack}>
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
