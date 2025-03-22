import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './pages/Login';
import UpBar from './components/up_bar';
import Register from './pages/Cards/Register.js';
import Type_account from './pages/Type_Acccount_chose';
import ThesisPropose from './pages/ThesisPropouse';
import RegFormProf from './unused/Regist_Form_Prof.js';
import ThesisInfo from './pages/Cards/ThesisInfoForm.js';
import Cabinet from './pages/Cards/MainPage.js';

import ThesisProposalForm from './pages/Cards/add_thesis_form.js';
import RegFormStudent from './pages/student-role/register_student';
import MyPropouseAdd from './pages/student-role/MyPropouseAdd';
import Favorite from './components/Favorite_Page';
import RestorePass from './pages/Restore_Password';
import MainPage from './pages/Test';
import ThesisModify from './pages/Cards/My_thesis_info';
import MyPropouse_Info from './pages/student-role/MyPropouse_Info';
import Applied_Info from './pages/Applied_Info.js';
import StudentChatPage from './pages/My_thesis_page.js';
import ProfesorChatPage from './pages/Profesor_Chat.js';
import Admin_Page from './pages/Admin_page copy.js';
import ThesisInfo_Admin from './pages/ThesisInfoForm_Admin.js';
import ThesisModify_Admin from './pages/My_thesis_info.js';
import Confirmed_Thesis_Info from './pages/Confirmed_Thesis_Info.js';
import MyConfirm_info_stud from './pages/student-role/Confirm_info.js';


function App() {

    return (
        <Router>
            <UpBar />
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/reg_stud" element={<RegFormStudent />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/restore_pass" element={<RestorePass />} />
                <Route path="/reg" element={<Register />} />
                <Route path="/type" element={<Type_account />} />
                <Route path="/reg_form" element={<RegFormProf />} />
   
                <Route path="/thesis" element={<ThesisPropose />} />
                <Route path="/thesisinfo" element={<ThesisInfo />} />
                <Route path="/prof" element={<Cabinet/>} />
                <Route path="/add_form" element={<ThesisProposalForm/>} />
                <Route path="/MyPropouseAdd" element={<MyPropouseAdd/>} />
                <Route path="/favorite" element={<Favorite/>} />
                <Route path="/test" element={<MainPage/>} />
                <Route path="/MyThesisInfo" element={<ThesisModify/>} />
                <Route path="/MyPropouse_Info" element={<MyPropouse_Info/>} />
                <Route path="/Applied_info" element={<Applied_Info/>} />
                <Route path="/Student_Chat" element={<StudentChatPage/>} />
                <Route path="/Prof_Chat" element={<ProfesorChatPage/>} />
                <Route path="/Admin_Page" element={<Admin_Page/>} />
                <Route path="/thesisinfo_admin" element={<ThesisInfo_Admin />} />
                <Route path="/thesis_modify_admin" element={<ThesisModify_Admin />} />
                <Route path="/confirmed_info_admin" element={<Confirmed_Thesis_Info />} />
                <Route path="/reg_stud" element={<RegFormStudent />} />
                <Route path="/Confirm_Info" element={<MyConfirm_info_stud />} />
                
            </Routes>
            
        </Router>
    );
}

export default App;
