import React, { useContext } from "react";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/UpBar.css";
import LoginPage from "./login_btn";
import { Button } from "@mui/material";
import { AppContext } from './AppContext'; 

function PersonalForm() {
    const { logined } = useContext(AppContext); // Accesează valoarea logined din context

    return (
       <div>
        <div id="form">
           
            {logined ? (
                <div>
                    {/* Afișează formularul dacă utilizatorul este autentificat */}
                    <h2>Name Plate</h2>

                <h2>Pagina Form</h2>
                    <h2>Pagina Form</h2>
                </div>
            ) : (
               
                <LoginPage />
            )}
        </div>
       </div>
    );
}

export default PersonalForm;
