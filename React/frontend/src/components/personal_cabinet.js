import React, { useContext } from "react";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/UpBar.css";
import LoginPage from "./login_btn";

import { AppContext } from './AppContext'; 

function PersonalForm() {
    const { logined } = useContext(AppContext);

    return (
       <div>
        <div className="form_account">
           
            {logined ? (
                <div>
                    {/* Afișează formularul dacă utilizatorul este autentificat */}
                    <h2>Name Plate</h2>
                    <h2>Pagina Form</h2>
                    <h2>Pagina Form</h2>
                </div>
            ) : (
               
                 <div className="enter_form">
                        <a href="login" className="link">Log in</a>
                        <a href="#" className="link">Register</a>
                    
                </div>
            )}
        </div>
       </div>
    );
}

export default PersonalForm;
