import React, { useContext } from "react";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/UpBar.css";
import { googleLogout } from "@react-oauth/google";
import { AppContext } from './AppContext'; 
import { useNavigate } from "react-router";

function PersonalForm() {
    const { logined, handleLogout } = useContext(AppContext);  
    const navigate = useNavigate();

    function goLogin() {
        navigate('/login');
    }

    // Obține datele utilizatorului din localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <div>
            <div className="form_account">
                {logined && userInfo ? (
                    <div>
                      
                        <h2>{userInfo.name}</h2>
                        {/* <h2>{userInfo.email}</h2> */}
                        {/* <h2>{userInfo.faculty}</h2> */}
                        <button onClick={() => {
                            googleLogout();
                            handleLogout(); 
                            goLogin();
                        }} className="log_btn">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="enter_form">
                        <a href="/login" className="link">Log in</a>
                        <a href="/type" className="link">Register</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalForm;
