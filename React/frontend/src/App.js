import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import LogIn from './pages/Login';
import UpBar from './components/up_bar';
import Footer from './components/footer';
import Register from './pages/Register';
import Type_account from './pages/Type_Acccount_chose';
import ThesisPropose from './pages/ThesisPropouse';
import RegFormProf from './pages/Regist_Form_Prof';
import ThesisInfo from './components/ThesisInfoForm';
function App() {

    return (
        <Router>
            <UpBar />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/reg" element={<Register />} />
                <Route path="/type" element={<Type_account />} />
                <Route path="/reg_form" element={<RegFormProf />} />
                <Route path="/thesis" element={<ThesisPropose />} />
                <Route path="/thesisinfo" element={<ThesisInfo />} />
            </Routes>
            
        </Router>
    );
}

export default App;
