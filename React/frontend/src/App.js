import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Log_in from './pages/Login';
function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/LogIn" element={<Log_in/>}/>
                </Routes>
            </Router>
        </>
    );
}

export default App;
