import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, Button, Fade } from '@mui/material';
import BACKEND_URL from '../server_link';

export default function ProfessorList({ faculty, onSelect }) {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

 
    useEffect(() => {
        if (faculty) {
            setLoading(true); 
            const fetchProfessors = async () => {
                try {
                    const response = await fetch(`${BACKEND_URL}/get-professors?faculty=${faculty}`);
                    if (!response.ok) throw new Error('Failed to fetch professors');
                    const data = await response.json();
                    setProfessors(data);
                } catch (error) {
                    console.error('Error fetching professors:', error);
                    setProfessors([]); 
                } finally {
                    setLoading(false); 
                }
            };

            fetchProfessors();
        }
    }, [faculty]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelectProfessor = (professor) => {
        setSelectedProfessor(professor);
        setAnchorEl(null);
        onSelect(professor); 
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                onClick={handleClick}
                disabled={loading || professors.length === 0}
                variant="outlined"
                style={{ margin: '10px 0' }}
            >
                {selectedProfessor ? selectedProfessor.name : loading ? 'Loading professors...' : 'Select Professor Name'}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {professors.map((professor) => (
                    <MenuItem key={professor.id} onClick={() => handleSelectProfessor(professor)}>
                        {professor.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
