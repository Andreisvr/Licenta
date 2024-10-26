import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/prof_cab.css';
import AddThesis from "/Users/Andrei_Sviridov/Desktop/React/frontend/src/pages/Prof_role/thesis_card.js";
import { AppContext } from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/AppContext.js';
import PersonIcon from '@mui/icons-material/Person'; 
import SchoolIcon from '@mui/icons-material/School'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function ProfCabinet() {
    const { name, email, logined, type } = useContext(AppContext);
    const navigate = useNavigate();

    if (!logined) {
        console.log('nu este logat');
    }

    if (logined) {
        console.log('este logat', name, email);
        console.log(type);
    }
   const  handleClickAdd  = ()=>{
        navigate('/add_form')
    }

    return (
        <div className="body_prof">
            <div className="left_container"></div>
            <div className="right_container">
                <div className="top_container">
                    <div className="button-group">
                        {type === "professor" ? (
                            <>
                                <button>ALL</button>
                                <button>MyThesis</button>
                                <button>Applied</button>
                                <button>Accepted</button>
                                
                            </>
                        ) : (
                            <>
                                <button>ALL</button>
                                <button>MyPropouse</button>
                                <button>MyAplies</button>
                                <button>Responsed</button>
                            </>
                        )}
                    </div>
                    <div className="icon-container">
                        {type === "professor" ? <PersonIcon className="icon" /> : <SchoolIcon className="icon" />}
                    </div>
                </div>
                <div className="bottom_container">
                
                    <AddThesis />
                    <AddThesis />
                    <AddThesis />
                    <AddThesis />
                    <AddThesis />
                    <AddThesis />
                    <AddThesis />
                    <AddThesis />
                    <AddThesis /> 

                 
                    {type === "professor" ?(
                    <div className="add-button-container">
                    <AddCircleOutlineIcon onClick={handleClickAdd} className="add_buton"  />
                    </div>
                    ):(<></>)
                    }
  
                </div>
            </div>
        </div>
    );
}
