import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [decodedToken, setDecodedToken] = useState(null);
    const [logined, setLogined] = useState(false);
    const [type, setType] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const storedLogined = localStorage.getItem('isLoggedIn') === 'true';
        const storedType = localStorage.getItem('userType'); 

        if (storedLogined) {
            setName(storedName);
            setEmail(storedEmail);
            setLogined(true);
            setType(storedType); 
        }
    }, []);

    const handleLogin = (userName, userEmail, userType) => {
        setName(userName);
        setEmail(userEmail);
        setLogined(true);
        setType(userType); 

        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType);
    };

    const handleLogout = () => {
        setName('');
        setEmail('');
        setLogined(false);
        setDecodedToken(null);
        setType(''); 

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
    };

    return (
        <AppContext.Provider value={{ 
            name, setName, 
            email, setEmail, 
            decodedToken, setDecodedToken, 
            logined, setLogined, 
            type, setType,  
            handleLogin, 
            handleLogout 
        }}>
            {children}
        </AppContext.Provider>
    );
};