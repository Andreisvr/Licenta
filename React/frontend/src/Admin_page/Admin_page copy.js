import React, { useEffect, useState,useContext } from "react";
import FacultyList from "../components/Faculty_List";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/Admin_page/Admin_Css copy/Admin_Page_css.css';
import InfoIcon from '@mui/icons-material/Info';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate } from "react-router";
import { AppContext } from "../components/AppContext";


export default function Admin_Page() {
    const { handleThesisId } = useContext(AppContext); 
    const [theses, setAllTheses] = useState([]);
    const [professors, setAllProfessors] = useState([]);
    const [students, setAllStudents] = useState([]);
    const [facultyError, setFacultyError] = useState(false);
    const [faculty, setFaculty] = useState('');
    const [program, setProgram] = useState('');
    const [selectedList, setSelectedList] = useState('professors'); 
    const navigate = useNavigate();
   
    useEffect(() => {
        if (faculty) {
            setFacultyError(false);

            fetch(`http://localhost:8081/getAllTheses?faculty=${faculty}`)
                .then((response) => response.json())
                .then((data) => {
                    setAllTheses(data);
                    console.log('Teze:', data);
                })
                .catch((error) => console.error("Error fetching theses:", error));

            fetch(`http://localhost:8081/getAllProfessors?faculty=${faculty}`)
                .then((response) => response.json())
                .then((data) => {
                    setAllProfessors(data);
                    console.log('Profesori:', data);
                })
                .catch((error) => console.error("Error fetching professors:", error));

            fetch(`http://localhost:8081/getStudents?faculty=${faculty}`)
                .then((response) => response.json())
                .then((data) => {
                    setAllStudents(data);
                    console.log('Studenții:', data);
                })
                .catch((error) => console.error("Error fetching students:", error));
        } else {
            setFacultyError(true);
        }
    }, [faculty]);

    const handleSelection = (faculty, program) => {
        setFaculty(faculty);
        setProgram(program);
    };

    const handleListSelection = (listName) => {
        setSelectedList(listName);
    };
    
    function HandleInfo(id) {
       
        handleThesisId(id);
        navigate(`/thesisinfo_admin`);
    }
    function HandleModify_Thesis(id)
    {
     
        handleThesisId(id);
        navigate(`/thesis_modify_admin`);
    }
    
    async function HandleDelete_Thesis(id) {
        if (!window.confirm("Sigur vrei să ștergi această teză?")) return;
    
        try {
            const response = await fetch("http://localhost:8081/thesis_admin", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Eroare la ștergere.");
            }
    
            console.log("Succes:", result.message);
            alert("Teza a fost ștearsă cu succes!");
            
            
            window.location.reload();
        } catch (error) {
            console.error("Eroare:", error);
            alert("A apărut o eroare la ștergere.");
        }
    }
    
    

    return (
        <div className="body_prof">
            <div className="right_container">
                <div className="top_container">
                    <div className="button-group">
                        <button onClick={() => handleListSelection('professors')}>Professors</button>
                        <button onClick={() => handleListSelection('students')}>Students</button>
                        <button onClick={() => handleListSelection('theses')}>Theses</button>
                        <button>Confirmed</button>
                       
                    </div>
                   
                </div>

                <div className="bottom_container">
                <FacultyList onSelect={handleSelection} />

                {facultyError && (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                        Trebuie să selectezi o facultate!
                    </p>
                )}

                    {selectedList === 'professors' && professors.length > 0 && (
                        <div className="list-container">
                            {professors.map((prof, index) => (
                                <div key={index} className="list-item">
                                     <div className="informations">
                                    <p className="text_info"><strong>Name: </strong> {prof.name}</p> 
                                    <p className="text_info"><strong>Email: </strong> {prof.email}</p> 
                                    <p className="text_info"><strong>Verified: </strong> {prof.entered}</p> 
                                    </div>
                                    <div className="button_grp">
                                        <InfoIcon className="InfoIcon" />
                                        <DeleteOutlineIcon className="DeleteOutlineIcon"/>
                                        <VerifiedUserIcon className="VerifiedUserIcon"/>
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedList === 'students' && students.length > 0 && (
                        <div className="list-container">
                            {students.map((student, index) => (
                                <div key={index} className="list-item">
                                    <div className="informations">
                                <p className="text_info"><strong>Name: </strong>{student.name}</p> 
                                <p className="text_info"> <strong>Email: </strong> {student.email} </p>
                                <p className="text_info"> <strong>Study Year: </strong>{student.study_year} </p>
                                <p className="text_info"> <strong>Have Thesis: </strong>{student.thesis_confirmed} </p>
                                </div>
                                <div className="button_grp">
                                        <InfoIcon className="InfoIcon" />
                                        <DeleteOutlineIcon className="DeleteOutlineIcon"/>
                                        
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedList === 'theses' && theses.length > 0 && (
                        <div className="list-container">
                            {theses.map((thesis, index) => (
                                <div key={index} className="list-item">
                                    <div className="informations">
                                    <p className="text_info"><strong>Title: </strong>{thesis.title}</p> 

                                    <p className="text_info"><strong>Professor: </strong>{thesis.prof_name}</p> 
                                    <p className="text_info">State: {thesis.state}</p> 
                                    </div>
                                    <div className="button_grp">
                                    <InfoIcon className="InfoIcon" onClick={() => HandleInfo(thesis.id)} />

                                        <DeleteOutlineIcon className="DeleteOutlineIcon" onClick={() => HandleDelete_Thesis(thesis.id)}/>
                                        <CreateIcon className="CreateIcon"  onClick={() => HandleModify_Thesis(thesis.id)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
