import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/addthesis_form.css';
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
            prof_name: professor.name,
        }));
        console.log('Profesor selectat:', professor.name);
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

        

        console.log('Trimis către server:', adjustedData);

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
