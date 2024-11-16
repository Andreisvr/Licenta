import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/addthesis_form.css';
import { AppContext } from '../../components/AppContext';
import ProfessorList from '../../components/Prof_List';

export default function MyPropouseAdd() {
    const { logined } = useContext(AppContext);
    const navigate = useNavigate();

    const userInfo = localStorage.getItem('userInfo');
    const user_info = JSON.parse(userInfo);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        additionalInfo: '',
        professorId: '',
        motivation: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfessorSelect = (professor) => {
        setFormData((prevData) => ({
            ...prevData,
            professorId: professor.id,
            prof_name:professor.name
        }));
        console.log('Profesor selectat:', professor.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const adjustedData = {
            title: formData.title,
            description: formData.description,
            additional_info: formData.additionalInfo,
            professor_id: formData.professorId,
            motivation: formData.motivation,
            user_faculty: user_info.Faculty,
            user_study_program: user_info.ProgramStudy,
            user_id: user_info.id,
            user_name:user_info.name,
            prof_name:formData.prof_name
        };

        console.log('adajusted ',adjustedData);
        try {
            const response = await fetch('http://localhost:8081/addProposal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adjustedData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit proposal');
            }

            const result = await response.json();
            console.log('Proposal submitted successfully:', result);

            
            setFormData({
                title: '',
                description: '',
                additionalInfo: '',
                professorId: '',
                motivation: '',
            });

            
            navigate('/prof');
        } catch (error) {
            console.error('Error submitting proposal:', error);
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
                Description:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </label>
    
            <label>
                Additional Information (*):
                <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                />
            </label>
    
            <label>
                Professor:
                <ProfessorList
                    faculty={user_info.Faculty}
                    onSelect={handleProfessorSelect}
                />
            </label>
    
            <label>
                Motivation:
                <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    required
                />
            </label>
    
            <button type="submit">Submit Proposal</button>
        </form>
    );
}    