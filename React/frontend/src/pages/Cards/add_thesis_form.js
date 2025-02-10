import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/addthesis_form.css';
import { AppContext } from '../../components/AppContext';

function ThesisForm() {
    const { logined } = useContext(AppContext);
    const navigate = useNavigate();

    if (!logined) {
        console.log('Nu este logat');
    }

    const userInfo = localStorage.getItem('userInfo');
    const user_info = JSON.parse(userInfo);
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        requirements: '',
        cover_letter: '',
    });

    const initialFormData = {
        title: '',
        faculty: user_info.faculty,
        
        prof_id: user_info.id,
        description: '',
        requirements: '',
        start_date: '',
        end_date: null,
        state: 'open',
        prof_name: user_info.name,
        cv_link: user_info.cv_link || null,
        email: user_info.email,
        limita: '',
        isLetterRequired: false, 
    };
   
    const [formData, setFormData] = useState(initialFormData);

   const handleChange = (e) => {
    const { name, value } = e.target;

   
    const limits = {
        title: 254,
        description: 2000,
        requirements: 2000,
        cover_letter: 2000,
    };

    
    if (limits[name] && value.length > limits[name]) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: `Ai depășit limita de ${limits[name]} caractere!`,
        }));
        return;
    } else {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    }

    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

    const handleCheckboxChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            isLetterRequired: e.target.checked, 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const adjustedData = {
            ...formData,
            isLetterRequired: formData.isLetterRequired,
        };

        console.log(adjustedData);
        
        try {
            const response = await fetch('http://localhost:8081/add_form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adjustedData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setFormData(initialFormData);
            navigate('/prof');

        } catch (error) {
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
                <small>{formData.title.length}/254</small>
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
                <small>{formData.description.length}/2000</small>
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
                <small>{formData.requirements.length}/2000</small>
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

           
            <label>
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
