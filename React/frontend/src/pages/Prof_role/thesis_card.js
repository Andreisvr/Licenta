import React from "react";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/addthesis.css'
import { useNavigate } from "react-router";
import { AppContext } from "../../components/AppContext";



export default function AddThesis(thesisName,number_of_aplies,date_start,date_end,faculty,study_program,description ){

    const navigate = useNavigate();

    const showInfo = () => {
        navigate('/thesisinfo');
        console.log(AppContext.Provider)
        console.log("Pagina add")
        
    };

    return(

        <form className="applied_form " onClick={showInfo}>
             <p className="text">{'Matematic Informatica'}</p>
             <p className="text">{'Informatica'}</p>
            <p className="text">{"Aplicație online de centralizare și selecție a temelor de licență"}</p>
           
            <div  className="add_date">
            <p className="text">{'20/10/2020'}</p>
            <p className="text">{'22/11/2021'}</p>
            </div>
            
            <p className="text">{'No. of aplications: 15'}</p>
            


        </form>
    );
}