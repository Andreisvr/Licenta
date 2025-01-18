// MainPage.js
import React from 'react';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Test.css';
import { useState,useContext } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect } from 'react';
import { AppContext } from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/AppContext.js';
import FacultyList from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/Faculty_List.js';
import MenuIcon from "@mui/icons-material/Menu";
import AddThesis from './Cards/thesis_card';
import UpBar from '../components/up_bar';


export default function MainPage () {
    const { type } = useContext(AppContext);
    const [showLeftContainer, setShowLeftContainer] = useState(false); 
    const [backgroundImage, setBackgroundImage] = useState('');

    
  
      
     
  
    const exampleTheses = [
       
        {
            thesisName: 'Machine Learning Techniques',
            faculty: 'Computer Science',
            study_program: 'AI and Data Science',
            description: 'Exploring supervised and unsupervised learning methods.',
            requirements: 'Python, TensorFlow',
            date_start: '2025-01-01',
            date_end: '2025-06-01',
            professor_name: 'Dr. John Doe',
            id: 1,
          },
          {
            thesisName: 'Machine Learning Techniques',
            faculty: 'Computer Science',
            study_program: 'AI and Data Science',
            description: 'Exploring supervised and unsupervised learning methods.',
            requirements: 'Python, TensorFlow',
            date_start: '2025-01-01',
            date_end: '2025-06-01',
            professor_name: 'Dr. John Doe',
            id: 1,
          }, {
            thesisName: 'Machine Learning Techniques',
            faculty: 'Computer Science',
            study_program: 'AI and Data Science',
            description: 'Exploring supervised and unsupervised learning methods.',
            requirements: 'Python, TensorFlow',
            date_start: '2025-01-01',
            date_end: '2025-06-01',
            professor_name: 'Dr. John Doe',
            id: 1,
          },
          {
            thesisName: 'Machine Learning Techniques',
            faculty: 'Computer Science',
            study_program: 'AI and Data Science',
            description: 'Exploring supervised and unsupervised learning methods.',
            requirements: 'Python, TensorFlow',
            date_start: '2025-01-01',
            date_end: '2025-06-01',
            professor_name: 'Dr. John Doe',
            id: 1,
          }, {
            thesisName: 'Machine Learning Techniques',
            faculty: 'Computer Science',
            study_program: 'AI and Data Science',
            description: 'Exploring supervised and unsupervised learning methods.',
            requirements: 'Python, TensorFlow',
            date_start: '2025-01-01',
            date_end: '2025-06-01',
            professor_name: 'Dr. John Doe',
            id: 1,
          }
          
      ];

    const toggleLeftContainer = () => {
        setShowLeftContainer(!showLeftContainer);
      }


    return (
    <div className="body_main">
      <UpBar/>
        <div className="search">
        <MenuIcon onClick={toggleLeftContainer} style={{ cursor: "pointer" }} />
        </div>
        <div className={`serch_container ${showLeftContainer ? "visible" : "hidden"}`}>
        <label className="search_labelt">Title</label>

        <input
           type="text"
           className="search_inputt"
           placeholder="Caută după titlu..."
          />



    <label className="date_labelt">Date interval</label>
        <input
           type="date"
           className="date_inputt"
           placeholder="Data Start"
           
          
          
       />
       <input
           type="date"
           className="date_inputtend"
           placeholder="Data End"/>
          
          
       {/*    
       
        <label className="search_label">Profesor</label>
       <input
           type="text"
           className="search_inputt"
           placeholder="Caută după profesor..."
          
          
           />
  


<button className="search_buttont">Caută</button>
<button className="search_buttont" >Rest</button> */}

        </div>

        
        <div 
      className={`menu_container ${showLeftContainer ? "default" : "full-width"}`}  >
        <div className={`topp_container ${showLeftContainer ? "default" : "full-width"}`}>
        <div className="button-group">
                {type === "professor" ? (
                   <>
                       <button >ALL</button>
                       <button >MyTheses</button>
                       <button >Applied</button>
                       <button >Propoused</button>
                       <button >Accepted</button>
                       <button >Confirmed</button>
                   </>
               ) : (
                   <>
                       <button >ALL</button>
                       <button >MyPropose</button>
                       <button >MyApplies</button>
                       <button >Responsed</button>
                       <button >MyThesis</button>

                   </>
               )}
        </div>
</div>
        <div className={`botom_container ${showLeftContainer ? "default" : "full-width"}`}>
        {exampleTheses.map((thesis) => (
                        <AddThesis
                          key={thesis.id}
                          thesisName={thesis.thesisName}
                          faculty={thesis.faculty}
                          study_program={thesis.study_program}
                          description={thesis.description}
                          requirements={thesis.requirements}
                          date_start={thesis.date_start}
                          date_end={thesis.date_end}
                          professor_name={thesis.professor_name}
                          onClick={() => console.log(`Thesis ${thesis.id} clicked`)}
                        />
                      ))}
        </div>
      </div>
</div>
       
    );
}

// <div className="body_main">
// <div className="search">
// <MenuIcon onClick={toggleLeftContainer} style={{ cursor: "pointer" }} />
// </div>
// <div className={`serch_container ${showLeftContainer ? "visible" : "hidden"}`}>
// <h3 className="section_title">Search Thesis</h3>

// <label className="search_label">Title</label>

// <input
//            type="text"
//            className="search_input"
//            placeholder="Caută după titlu..."
          
           
//        />
//     <label className="search_label">Date interval</label>
//        <input
//            type="date"
//            className="date_input"
//            placeholder="Data Start"
          
          
//        />
//        <input
//            type="date"
//            className="date_input"
//            placeholder="Data End"
          
           
//        />
//         <label className="search_label">Profesor</label>
//        <input
//            type="text"
//            className="search_input"
//            placeholder="Caută după profesor..."
          
          
//            />
//    <label className="search_label">Faculty/Study Program</label>

// <FacultyList  />

// <button className="search_button">Caută</button>
// <button className="search_button" >Rest</button>

// </div>
// <div className={`menu_container ${showLeftContainer ? "default" : "full-width"}`}>
//        <div className="top_container">
//            <div className="button-group">
//                {type === "professor" ? (
//                    <>
//                        <button >ALL</button>
//                        <button >MyTheses</button>
//                        <button >Applied</button>
//                        <button >Propoused</button>
//                        <button >Accepted</button>
//                        <button >Confirmed</button>
//                    </>
//                ) : (
//                    <>
//                        <button >ALL</button>
//                        <button >MyPropose</button>
//                        <button >MyApplies</button>
//                        <button >Responsed</button>
//                        <button >MyThesis</button>

//                    </>
//                )}
//            </div>
//            <div className="icon-container">
//                {type === "professor" ? <PersonIcon className="icon" /> : <SchoolIcon className="icon" />}
//            </div>
//        </div>
      
//        <div className="bottom_container">
   
//        {exampleTheses.map((thesis) => (
//    <AddThesis
//      key={thesis.id}
//      thesisName={thesis.thesisName}
//      faculty={thesis.faculty}
//      study_program={thesis.study_program}
//      description={thesis.description}
//      requirements={thesis.requirements}
//      date_start={thesis.date_start}
//      date_end={thesis.date_end}
//      professor_name={thesis.professor_name}
//      onClick={() => console.log(`Thesis ${thesis.id} clicked`)}
//    />
//  ))}
// <div className="add-button-container">
//    <AddCircleOutlineIcon className="add_button" />
// </div>

// </div>
//    </div>
// </div>