import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import LogIn from './pages/Login';
import UpBar from './components/up_bar';
import Register from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/pages/Prof_role/Register.js';
import Type_account from './pages/Type_Acccount_chose';
import ThesisPropose from './pages/ThesisPropouse';
import RegFormProf from './pages/Regist_Form_Prof';
import ThesisInfo from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/pages/Cards/ThesisInfoForm.js';
import Cabinet from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/pages/Cards/MainPage.js';
import RegisterStud from './pages/Register_Form_Stud';
import ThesisProposalForm from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/pages/Cards/add_thesis_form.js';
import RegFormStudent from './pages/student-role/register_student';
import MyPropouseAdd from './pages/student-role/MyPropouseAdd';
import Favorite from './components/Favorite_Page';
import RestorePass from './pages/Restore_Password';
import MainPage from './pages/Test';
import ThesisModify from './pages/Cards/My_thesis_info';
import MyPropouse_Info from './pages/student-role/MyPropouse_Info';
import Applied_Info from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/pages/Applied_Info.js';
import StudentChatPage from './Student_Chat/My_thesis_page';
import ProfesorChatPage from './Profesor_Chat/Profesor_Chat';
import Admin_Page from './Admin_page/Admin_page copy';
import ThesisInfo_Admin from './Admin_page/Thesis/ThesisInfoForm_Admin';
import ThesisModify_Admin from './Admin_page/Thesis/My_thesis_info';
import Confirmed_Thesis_Info from './Admin_page/Confirmed_Thesis_Info';
function App() {

    return (
        <Router>
            <UpBar />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/reg_stud" element={<RegFormStudent />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/restore_pass" element={<RestorePass />} />
                <Route path="/reg" element={<Register />} />
                <Route path="/type" element={<Type_account />} />
                <Route path="/reg_form" element={<RegFormProf />} />
                <Route path="/reg_form_stud" element={<RegisterStud/>} />
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
                
            </Routes>
            
        </Router>
    );
}

export default App;
