import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import "../../page_css/addthesis_form.css";
import { AppContext } from '../../components/AppContext';
import ProfessorList from '../../components/Prof_List';

export default function MyPropouseAdd() {
    const { logined, email, name} = useContext(AppContext);
    const navigate = useNavigate();

    const userInfo = localStorage.getItem('userInfo');
    const user_info = JSON.parse(userInfo);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        motivation: '',
        professorId: '',
        prof_name: '',
    });

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        motivation: '',
    });


    const invalidCharsRegex = /[^a-zA-Z0-9À-ÿ\s,.'-]/;


     const handleChange = (e) => {
        const { name, value } = e.target;

       
        const limits = {
            title: 254,
            description: 2000,
            motivation: 2000,
        };

        
        if (value.length > limits[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: `Maximum ${limits[name]} characters allowed.`,
            }));
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


    const handleProfessorSelect = (professor) => {
        setFormData((prevData) => ({
            ...prevData,
            professorId: professor.id,
            prof_name: professor.name,
        }));
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const adjustedData = {
            title: formData.title,
            study_program: user_info.ProgramStudy,
            faculty: user_info.Faculty,
            prof_id: formData.professorId,
            prof_name: formData.prof_name,
            stud_name: user_info.name,
            stud_email: email,
            description: formData.description,
            motivation: formData.motivation,
            state: 'waiting',
            date: new Date().toISOString(), 
            stud_id: user_info.id
        };

        

       

        try {
            const response = await fetch(`http://localhost:8081/Propouses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adjustedData),
            });

            if (response.ok) {
                console.log('Propunere salvată cu succes');
                setFormData({
                    title: '',
                    description: '',
                    motivation: '',
                    professorId: '',
                    prof_name: '',
                });
                navigate('/prof');
            } else {
                console.error('Eroare la salvarea propunerii');
            }
        } catch (error) {
            console.error('Eroare la cererea către server:', error);
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
                    maxLength={254}
                    required
                />
                <small>{formData.title.length}/254</small>
                {errors.title && <p className="error">{errors.title}</p>}
            </label>

            <label>
                Description:
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={2000}
                    required
                />
                  <small>{formData.description.length}/2000</small>
                {errors.description && <p className="error">{errors.description}</p>}
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
                    maxLength={2000}
                    required
                />
                
                <small>{formData.motivation.length}/2000</small>
                {errors.motivation && <p className="error-message">{errors.motivation}</p>}
            </label>

            <button type="submit">Submit Proposal</button>
        </form>
    );
}
