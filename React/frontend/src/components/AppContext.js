import React, { createContext, useEffect, useState } from 'react';

// Create a Context for the app's global state
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // State variables to store user information and app status
    const [name, setName] = useState('');               // User's name
    const [email, setEmail] = useState('');             // User's email
    const [decodedToken, setDecodedToken] = useState(null); // Decoded token (e.g., from JWT)
    const [logined, setLogined] = useState(false);      // Login status boolean
    const [type, setType] = useState('');               // User type (e.g., professor/student)
    const [userInfo, setUserInfo] = useState(null);     // Additional user info object
    const [program, setProgram] = useState('');         // User's study program
    const [faculty, setFaculty] = useState('');         // User's faculty
    const [thesis_id , setIdThesis] = useState('');     // Selected thesis ID
    const [admin , setAdmin] = useState('');             // Admin status or ID
    
    const [conf , setConfirm_info] = useState('');       // Confirmation info state
    const [stud_id , setStud_id] = useState('');         // Student ID

    // Load stored user data from localStorage when component mounts
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const storedLogined = localStorage.getItem('isLoggedIn') === 'true';
        const storedType = localStorage.getItem('userType'); 
        const storedUserInfo = localStorage.getItem('userInfo'); 
        const storedProgram = localStorage.getItem('userProgram'); 
        const storedFaculty = localStorage.getItem('userFaculty'); 
        
        // If user is logged in, restore state from localStorage
        if (storedLogined) {
            setName(storedName);
            setEmail(storedEmail);
            setLogined(true);
            setType(storedType);
            setProgram(storedProgram); 
            setFaculty(storedFaculty); 
            
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo)); 
            }
        }
    }, []);

    // Handler to update thesis ID state and store it locally
    const handleThesisId=(thesis_id)=>{
        setIdThesis(thesis_id);
        localStorage.setItem('thesis_id', thesis_id); 
    }

    // Handler to update admin state and store it locally
    const handleAdmin=(admin)=>{
        setIdThesis(admin);
        localStorage.setItem('admin', admin);    
    }

    // Handler to update student ID state and store it locally
    const handleStud_id=(stud_id)=>{
        setStud_id(stud_id); 
        localStorage.setItem('stud_id', stud_id); 
    }

    // Handler to update confirmation info state
    const handleConfirm=(conf)=>{
        setConfirm_info(conf); 
    }

    // Handler for login action: updates state and localStorage with user data
    const handleLogin = (userName, userEmail, userType, userProgram, userFaculty) => {
        setName(userName);
        setEmail(userEmail);
        setLogined(true);
        setType(userType); 
        setProgram(userProgram);
        setFaculty(userFaculty); 

        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType);
        localStorage.setItem('userProgram', userProgram); 
        localStorage.setItem('userFaculty', userFaculty); 
    };

    // Handler for logout action: clears all user-related state and localStorage
    const handleLogout = () => {
        setName('');
        setEmail('');
        setLogined(false);
        setDecodedToken(null);
        setType(''); 
        setUserInfo(null); 
        setProgram('');
        setFaculty('');

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('userInfo'); 
        localStorage.removeItem('userProgram'); 
        localStorage.removeItem('userFaculty');
    };

    // Provide state and handlers to children components through context
    return (
        <AppContext.Provider value={{ 
            name, setName, 
            email, setEmail, 
            decodedToken, setDecodedToken, 
            logined, setLogined, 
            type, setType,  
            userInfo, 
            program, setProgram, 
            faculty, setFaculty, 
            handleLogin, 
            handleLogout,
            thesis_id,handleThesisId,
            stud_id,handleStud_id,
            handleAdmin,admin,conf,handleConfirm
            
        }}>
            {children}
        </AppContext.Provider>
    );
};
