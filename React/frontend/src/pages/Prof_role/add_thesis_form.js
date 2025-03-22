import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import "../../page_css/addthesis_form.css";
import FacultyList from '../../components/Faculty_List';
import { AppContext } from '../../components/AppContext';
import BACKEND_URL from '../../server_link';

function ThesisForm() {
    const { name, email, logined, type } = useContext(AppContext);
    const navigate = useNavigate();
  

    if (!logined) {
        console.log('nu este logat');
    } else {
        console.log('este logat', name, email, type);  
    }
   const userInfo = localStorage.getItem('userInfo');

   const user_info = JSON.parse(userInfo);
    console.log('userinfo',user_info);


    const initialFormData = {
        title: '',
        faculty: '',
        studyProgram: '',
        prof_id: user_info.id || '12',
        description: '',
        requirements: '',
        start_date: '',
        end_date: '',
        state: 'open',
        prof_name: user_info.name
    };

    const [formData, setFormData] = useState(initialFormData);
    console.log('userinfo',user_info.name);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelection = (faculty, program) => {
        console.log('Selected Faculty:', faculty);
        console.log('Selected Program:', program);
        setFormData((prevData) => ({
            ...prevData,
            faculty: faculty,
            studyProgram: program,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        console.log('Name',formData.name);

        const adjustedData = {
            title: formData.title,
            faculty: formData.faculty,
            study_program: formData.studyProgram,
            prof_id: formData.prof_id,
            description: formData.description,
            requirements: formData.requirements || null,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            state: formData.state,
            prof_name: formData.prof_name 

        };

        try {
            const response = await fetch(`${BACKEND_URL}/add_form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adjustedData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);

            
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
