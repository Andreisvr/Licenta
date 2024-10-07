import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import UpBar from './components/up_bar';

function App() {
    return (
        <>
            <UpBar />
            <Router>
                <Routes>
                    <Route path="/" element={<Main />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
