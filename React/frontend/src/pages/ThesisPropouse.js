import React , {useContext} from "react";


import "../page_css/ThesisPropouse.css";
import ThesisBox from "../components/Thesis_box";
import ProfList from "../components/Prof_List.js";
import FacultyList from "../components/Faculty_List.js";
import Available from "../components/avaliable_search_option.js";
import { AppContext } from "../components/AppContext.js";

export default function ThesisPropose() {

    const { name, email, logined } = useContext(AppContext);
    if (!logined) {
        console.log('nu este logat');

    }

    if (logined) {
        console.log('este logat',name,email);
        
    }
    
    return (
        <div className="body_thesis">
            <div className="search-options">
                
                <h2>Search Options</h2>
                <ProfList/>
                <FacultyList customStyles={{  border: '2px solid white' }} />
            <div className="date-inputs">
                <label className="date-label">From:</label>
                <input type="date" className="inputBox date"/>
    
                 <label className="date-label">To:</label>
                <input  type="date" className="inputBox date"/>
            </div> 
               <Available/>
            </div>

            <div className="options-container">
               <div className="space"></div>
               <ThesisBox 
                thesisName="Sistem inteligent de gestionare"
                professorName="Ion Popescu"
                facultyName="Facultatea de Informatică" 
                studyProgram="Program de licență în Informatică"
                description="Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe.."
                startDate='20.06.2024'
                endDate="30.06.2024"
                proposalStatus="proposed"
                />

                <ThesisBox    
                thesisName="Sistem inteligent de gestionare"
                professorName="Ion Popescu"
                facultyName="Facultatea de Informatică" 
                studyProgram=""
                description="Această temă seAceastă temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe.. concentrează pe..Această temă se coAceastă temă se concentrează pe.."
                startDate='20.06.2024'
                endDate="30.06.2024"
                proposalStatus="blocked"
                />
                 <ThesisBox    
                thesisName="Sistem inteligent de gestionare"
                professorName="Ion Popescu"
                facultyName="Facultatea de Informatică" 
                studyProgram="Program de licență în Informatică"
                description="Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe..Această temă se concentrează pe..Această temă se coAceastă temă se concentrează pe.."
                startDate='20.06.2024'
                endDate="30.06.2024"
                proposalStatus="without"
                />
                <ThesisBox/>
                <ThesisBox  />
                <ThesisBox   />
                <div className="space"></div>
            </div>
        </div>
    );
}
