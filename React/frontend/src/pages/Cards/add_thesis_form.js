import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { AppContext } from '../../components/AppContext';  // Import context for global app state
import "../../page_css/addthesis_form.css";  // Import CSS for styling the form
import BACKEND_URL from '../../server_link';  // Backend API base URL
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Icon for back button (currently unused)

function ThesisForm() {
    const { logined } = useContext(AppContext);  // Get login status from app context
    const navigate = useNavigate();  // Hook for programmatic navigation

    // If user is not logged in, log a message (could be enhanced with redirect or alert)
    if (!logined) {
        console.log('Nu este logat');
    }

    // Get user info stored locally (assumed logged-in user's data)
    const userInfo = localStorage.getItem('userInfo');
    const user_info = JSON.parse(userInfo);

    // State to track validation errors for the form fields
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        requirements: '',
        cover_letter: '',
    });

    // Handler to navigate back to the professor dashboard or previous page
    const handleBack = () => {
        navigate("/prof");
    };

    // Initial form data populated with default values and user info
    const initialFormData = {
        title: '',
        faculty: user_info.faculty,  // Faculty from user info
        prof_id: user_info.id,       // Professor ID from user info
        description: '',
        requirements: '',
        start_date: '',
        end_date: null,
        state: 'open',               // Default state of the thesis proposal
        prof_name: user_info.name,   // Professor name from user info
        cv_link: user_info.cv_link || null,  // CV link or null if none
        email: user_info.email,
        limita: '',                  // Limit for number of places (slots)
        isLetterRequired: false,     // Whether cover letter is required (checkbox)
    };
   
    // State to hold current form data
    const [formData, setFormData] = useState(initialFormData);

    // Handler for input and textarea changes (except checkbox)
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Define max length limits for form fields
        const limits = {
            title: 254,
            description: 2000,
            requirements: 2000,
            cover_letter: 2000,
        };

        // Check if input exceeds limits, update errors state accordingly
        if (limits[name] && value.length > limits[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: `Ai depășit limita de ${limits[name]} caractere!`,
            }));
            return; // Do not update form data if limit exceeded
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }

        // Update form data with the new value
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handler specifically for checkbox changes
    const handleCheckboxChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            isLetterRequired: e.target.checked,  // Update isLetterRequired boolean
        }));
    };

    // Form submit handler, sends data to backend and handles response
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data to send, here just spreading formData
        const adjustedData = {
            ...formData,
            isLetterRequired: formData.isLetterRequired,
        };

        console.log(adjustedData);
        
        try {
            // POST request to backend endpoint to add thesis proposal
            const response = await fetch(`${BACKEND_URL}/add_form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adjustedData),
            });

            // Throw error if response is not successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Reset form data to initial state after successful submit
            setFormData(initialFormData);

            // Navigate back to professor dashboard page
            navigate('/prof');

        } catch (error) {
            // Log error if submit fails
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
                    maxLength={254}
                />
                {/* Show character count for title */}
                <small>{formData.title.length}/254</small>
                {/* Show validation error if any */}
                {errors.title && <p className="error-message">{errors.title}</p>}
            </label>

            <label>
                Description:
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                    maxLength={2000}
                />
                {/* Show character count for description */}
                <small>{formData.description.length}/2000</small>
                {/* Show validation error if any */}
                {errors.description && <p className="error-message">{errors.description}</p>}
            </label>

            <label>
                Requirements:
                <textarea 
                    name="requirements" 
                    value={formData.requirements} 
                    onChange={handleChange} 
                    maxLength={2000}
                />
                {/* Show character count for requirements */}
                <small>{formData.requirements.length}/2000</small>
                {/* Show validation error if any */}
                {errors.requirements && <p className="error-message">{errors.requirements}</p>}
            </label>

            <label>
                Limită de locuri:
                <input
                    type="number"
                    name="limita"
                    value={formData.limita}
                    onChange={handleChange}
                    required
                    min="1"
                    step="1"
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

            <label className='check_b'>
                <input 
                    type="checkbox"
                    name="isLetterRequired"
                    checked={formData.isLetterRequired}
                    onChange={handleCheckboxChange}
                />
               Cover letter required?
            </label>

            <button type="submit">Submit Proposal</button>
        </form>
    );
}

export default ThesisForm;
