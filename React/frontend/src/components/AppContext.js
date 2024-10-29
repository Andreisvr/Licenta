import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [decodedToken, setDecodedToken] = useState(null);
    const [logined, setLogined] = useState(false);
    const [type, setType] = useState('');
    const [userInfo, setUserInfo] = useState(null); // Adăugăm userInfo

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const storedLogined = localStorage.getItem('isLoggedIn') === 'true';
        const storedType = localStorage.getItem('userType'); 
        const storedUserInfo = localStorage.getItem('userInfo'); // Verificăm dacă avem userInfo în localStorage

        if (storedLogined) {
            setName(storedName);
            setEmail(storedEmail);
            setLogined(true);
            setType(storedType);
            
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo)); // Setăm userInfo din localStorage
            }
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
        setUserInfo(null); // Resetăm userInfo la logout

        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('userInfo'); // Ștergem userInfo din localStorage
    };

    return (
        <AppContext.Provider value={{ 
            name, setName, 
            email, setEmail, 
            decodedToken, setDecodedToken, 
            logined, setLogined, 
            type, setType,  
            userInfo, // Expunem userInfo
            handleLogin, 
            handleLogout 
        }}>
            {children}
        </AppContext.Provider>
    );
};
