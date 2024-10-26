import React, { useContext } from "react";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/UpBar.css";
import { googleLogout } from "@react-oauth/google";
import { AppContext } from './AppContext'; 

function PersonalForm() {
    const { logined, handleLogout } = useContext(AppContext);  // Preluăm handleLogout din context

    return (
        <div>
            <div className="form_account">
                {logined ? (
                    <div>
                        {/* Afișează formularul dacă utilizatorul este autentificat */}
                        <h2>Name Plate</h2>
                        <h2>Pagina Form</h2>
                        <h2>Pagina Form</h2>
                        <button onClick={() => {
                            googleLogout();
                            handleLogout(); 
                        }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="enter_form">
                        <a href="login" className="link">Log in</a>
                        <a href="type" className="link">Register</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalForm;
