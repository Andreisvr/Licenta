import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({children})=>{
    const[name,setName] = useState('');
    const [email, setEmail] = useState('');
    const [decodedToken, setDecodedToken] = useState(null);
    const [logined, setLogined] = useState(false);


    return (
        <AppContext.Provider value={{ name, setName, email, setEmail, decodedToken, setDecodedToken, logined, setLogined }}>
            {children}
        </AppContext.Provider>
    );
};
