import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import "../../page_css/addthesis_form.css";
import FacultyList from '../../components/Faculty_List';
import { AppContext } from '../../components/AppContext';
import BACKEND_URL from '../../server_link';

function ThesisForm() {
  // Get user data and login status from the app-wide context
const { name, email, logined, type } = useContext(AppContext);

// Hook to navigate programmatically between routes
const navigate = useNavigate();

// Check if user is logged in and log status + user info
if (!logined) {
    console.log('nu este logat');  // User is NOT logged in
} else {
    console.log('este logat', name, email, type);  // User IS logged in, log user info
}

// Retrieve user info stored in localStorage as a JSON string
const userInfo = localStorage.getItem('userInfo');

// Parse the JSON string into a JavaScript object
const user_info = JSON.parse(userInfo);
console.log('userinfo', user_info);

// Define initial form data state, pre-filling some fields using user_info
const initialFormData = {
    title: '',               // Thesis title
    faculty: '',             // Faculty selection
    studyProgram: '',        // Study program selection
    prof_id: user_info.id || '12',  // Professor ID (default to '12' if missing)
    description: '',         // Thesis description
    requirements: '',        // Optional requirements
    start_date: '',          // Start date of the thesis/project
    end_date: '',            // End date (optional)
    state: 'open',           // Current state of the thesis, default to 'open'
    prof_name: user_info.name  // Professor's name from user info
};

// React state for form inputs, initialized with the above object
const [formData, setFormData] = useState(initialFormData);

console.log('userinfo', user_info.name);  // Debug: log professor's name

// Handler to update form state on input changes
const handleChange = (e) => {
    const { name, value } = e.target;  // Extract input name and value
    // Update only the changed field in formData state
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

// Handler for selecting faculty and study program, updating formData accordingly
const handleSelection = (faculty, program) => {
    console.log('Selected Faculty:', faculty);
    console.log('Selected Program:', program);
    setFormData((prevData) => ({
        ...prevData,
        faculty: faculty,
        studyProgram: program,
    }));
};

// Form submission handler, triggered on form submit event
const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload on form submission

    console.log('Form data submitted:', formData);
    console.log('Name', formData.name);  // Debug log

    // Prepare data object to send to backend, matching expected API fields
    const adjustedData = {
        title: formData.title,
        faculty: formData.faculty,
        study_program: formData.studyProgram,
        prof_id: formData.prof_id,
        description: formData.description,
        requirements: formData.requirements || null,  // Set null if empty string
        start_date: formData.start_date,
        end_date: formData.end_date || null,  // Optional end date
        state: formData.state,
        prof_name: formData.prof_name,
    };

    try {
        // Send POST request to backend with form data as JSON
        const response = await fetch(`${BACKEND_URL}/add_form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adjustedData),
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse response JSON data
        const result = await response.json();
        console.log(result);  // Log server response

        // Reset form to initial state after successful submission
        setFormData(initialFormData);

        // Navigate user back to the professor dashboard or relevant page
        navigate('/prof');

    } catch (error) {
        // Log any errors during the submission process
        console.error('Error submitting form:', error);
    }
};

    return (
        <form className="thesis-form" onSubmit={handleSubmit}>
            <label>
                Title:
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />
            </label>

            <label>
                Faculty:
                <FacultyList onSelect={handleSelection} />
            </label>

            <label>
                Description:
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />
            </label>

            <label>
                Requirements:
                <textarea 
                    name="requirements" 
                    value={formData.requirements} 
                    onChange={handleChange} 
                    
                />
            </label>

            <label>
                Start Date:
                <input 
                    type="date" 
                    name="start_date" 
                    value={formData.start_date} 
                    onChange={handleChange} 
                    required 
                />
            </label>

            <label>
                End Date:
                <input 
                    type="date" 
                    name="end_date" 
                    value={formData.end_date} 
                    onChange={handleChange} 
                />
            </label>

            <button type="submit">Submit Proposal</button>
        </form>
    );
}

export default ThesisForm;
