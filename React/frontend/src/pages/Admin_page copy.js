import React, { useEffect, useState,useContext } from "react";
import FacultyList from "../components/Faculty_List";
import "../page_css/Admin_Page_css.css";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import InfoIcon from '@mui/icons-material/Info';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate } from "react-router";
import { AppContext } from "../components/AppContext";
import CloseIcon from '@mui/icons-material/Close';
import BACKEND_URL from "../server_link";

export default function Admin_Page() {
    const { handleThesisId,handleConfirm,handleAdmin } = useContext(AppContext); 
    const [theses, setAllTheses] = useState([]);
    const [professors, setAllProfessors] = useState([]);
    const [students, setAllStudents] = useState([]);
    const [confirmed, setAllConfirmed] = useState([]);
    const [finalList, setFinalList] = useState([]);
    const [facultyError, setFacultyError] = useState(false);
    const [faculty, setFaculty] = useState('');
    const [program, setProgram] = useState('');
    const [selectedList, setSelectedList] = useState('professors'); 
     
    
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the current user is an admin by reading localStorage
        const admin = localStorage.getItem("admin");
    
        // If not admin, redirect to login page
        if (admin !== 'admin') {
          navigate("/login"); 
          return; 
        }
    
        // If admin is logged in
        if (admin === 'admin') {
            // Retrieve saved selections from localStorage (faculty, program, last viewed list)
            const savedFaculty = localStorage.getItem("selectedFaculty");
            const savedProgram = localStorage.getItem("selectedProgram");
            const savedList = localStorage.getItem("lastViewedList");
    
            // Restore the last viewed list if available
            if (savedList) {
                setSelectedList(savedList);  
            }
    
            // Restore saved faculty and program selections
            if (savedFaculty) {
                setFaculty(savedFaculty);
            }
            if (savedProgram) {
                setProgram(savedProgram);
            }
    
            // If faculty is set, clear any faculty error and fetch necessary data
            if (faculty) {
                setFacultyError(false);
    
                // Fetch all necessary data concurrently from backend APIs
                Promise.all([
                    fetch(`${BACKEND_URL}/getAllTheses?faculty=${faculty}`).then(res => res.json()),
                    fetch(`${BACKEND_URL}/getAllProfessors?faculty=${faculty}`).then(res => res.json()),
                    fetch(`${BACKEND_URL}/getStudents?faculty=${faculty}`).then(res => res.json()),
                    fetch(`${BACKEND_URL}/getAllConfirmed`).then(res => res.json())
                ])
                .then(([thesesData, professorsData, studentsData, confirmedData]) => {
                    // Store fetched data into state variables
                    setAllTheses(thesesData);
                    setAllProfessors(professorsData);
                    setAllStudents(studentsData);
                    setAllConfirmed(confirmedData);
    
                    // Combine all fetched info into a single list for easier use
                    const combinedList = combineInfo(confirmedData, studentsData, professorsData, thesesData);
                    setFinalList(combinedList);
    
                })
                .catch((error) => console.error("Error fetching data:", error));
            } else {
                // If no faculty selected, show error
                setFacultyError(true);
            }
        }
    }, [faculty]);  // Re-run this effect when 'faculty' changes
    
    
    // Combine data from confirmed entries, students, professors, and theses for display
    function combineInfo(confirmed, students, professors, theses) {
        return confirmed.map(item => {
            // Find student, professor, and thesis objects related to the confirmation entry
            const student = students.find(s => s.id === item.id_stud);
            const professor = professors.find(p => p.id === item.id_prof);
            const thesis = theses.find(t => t.id === item.id_thesis);
    
            // Return a merged object containing all related info
            return {
                ...item,
                student: student || {},
                professor: professor || {},
                thesis: thesis || {}
            };
        });
    }
    
    // Handle selection of faculty and program, updating state and saving to localStorage
    const handleSelection = (faculty, program) => {
        setFaculty(faculty);
        setProgram(program);
        localStorage.setItem("selectedFaculty", faculty);
        localStorage.setItem("selectedProgram", program);
    };
    
    // Handle selection of which list is currently viewed and save to localStorage
    const handleListSelection = (listName) => {
        setSelectedList(listName);
        localStorage.setItem("lastViewedList", listName);
    };
    
    // Navigate to thesis info page with selected thesis ID
    function HandleInfo(id) {
        handleThesisId(id);
        navigate(`/thesisinfo_admin`);
    }
    
    // Navigate to thesis modification page with selected thesis ID
    function HandleModify_Thesis(id) {
        handleThesisId(id);
        navigate(`/thesis_modify_admin`);
    }
    
    // Delete a thesis after user confirmation
    async function HandleDelete_Thesis(id) {
        if (!window.confirm("Are you sure you want to delete this thesis? It will be removed from all fields, even if it has been confirmed by someone.")) return;
    
        try {
            const response = await fetch(`${BACKEND_URL}/thesis_admin`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Eroare la ștergere.");
            }
    
            console.log("Success:", result.message);
            alert("Teza a fost ștearsă cu succes!");
            
            // Redirect to '/prof' page and reload to update data
            navigate("/prof");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("A apărut o eroare la ștergere.");
        }
    }
    
    // Delete a student after confirmation
    async function Delet_student(id) {
        if (!window.confirm(`Are you sure you want to delete this student? It will be removed from all fields, even if it has been confirmed by someone. Student ID-ul ${id}?`)) return;
    
        try {
            const response = await fetch(`${BACKEND_URL}/delete_student_admin`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Error removing");
            }
    
            console.log("Success:", result.message);
            alert("Studentul is removed!");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        }
    }
    
    // Verify or revoke professor status with confirmation dialogs
    async function VerifieProfesor(id, entered) {
        if (entered == 0) {
            if (!window.confirm(`Are you sure you want to approve this user as a Professor with the ability to add thesis topics? ID: ${id}`)) return;
        } else if (entered == 1) {
            if (!window.confirm(`Are you sure you want to revoke this user's Professor status, removing their ability to add thesis topics? ID: ${id}`)) return;
        }
    
        try {
            const response = await fetch(`${BACKEND_URL}/Verify_Profesor`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, entered }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Eroare la actualizare.");
            }
    
            console.log("Success:", result.message);
            alert("Profesorul a fost verificat cu succes!");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("A apărut o eroare la verificare.");
        }
    }
    
    // Delete a professor after confirmation
    async function Delete_Profesor(id) {
        if (!window.confirm(`Are you sure you want to delete this Professor? It will be removed from all fields, even if it has been confirmed thesis. Professor ID-ul ${id}?`)) return;
    
        try {
            const response = await fetch(`${BACKEND_URL}/delet_profesor_admin`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Eroare la ștergere.");
            }
    
            console.log("Success:", result.message);
            alert("Profesorul a fost ștears cu succes!");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("A apărut o eroare la ștergere.");
        }
    }
    
    // Delete a confirmation entry after user confirmation
    async function HandleDelete_Confirm(id, id_stud) {
        console.log(id, id_stud);
        if (!window.confirm(`Are you sure you want to delete this Confirmation? It will be removed from all fields, Confirmation ID-ul ${id}?`)) return;
    
        try {
            const response = await fetch(`${BACKEND_URL}/delete_confirmation_admin`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, id_stud }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Eroare la ștergere.");
            }
    
            console.log("Success:", result.message);
            alert("Profesorul a fost ștears cu succes!");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("A apărut o eroare la ștergere.");
        }
    }
    
    // Logout function: clear admin state and navigate to login
    function Logout() {
        handleAdmin('logout');
        navigate('/login');
    }
    
    // Format an ISO date string into dd/mm/yyyy format, return empty string for invalid dates
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        if (date.getTime() === 0) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Show detailed confirmation info and navigate to confirmation info page
    function HandleShowInfo(info) {
        handleConfirm(info);
        navigate('/confirmed_info_admin');
    }
    
    return (
        <div className="body_prof">
            <div className="right_container">
                <div className="top_container">
                    <div className="button-group">
                        <button onClick={() => handleListSelection('professors')}>Professors</button>
                        <button onClick={() => handleListSelection('students')}>Students</button>
                        <button onClick={() => handleListSelection('theses')}>Theses</button>
                        <button onClick={() => handleListSelection('confirmed')}>Confirmed</button>
                       
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
                                    <p className="text_info"><strong>ID: </strong> {prof.id}</p>
                                    </div>
                                    <div className="button_grp">
                                        
                                        <DeleteOutlineIcon className="DeleteOutlineIcon" onClick={() => Delete_Profesor(prof.id)}/>
                                       
                                         {prof.entered === 0 ? (
                                        <VerifiedUserIcon  className="VerifiedUserIcon" onClick={() => VerifieProfesor(prof.id,prof.entered)}  />
                                      ) : (
                                        <CloseIcon className="CloseIcon" onClick={() => VerifieProfesor(prof.id,prof.entered)} />
                                      )}
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
                                        <p className="text_info"> <strong>ID: </strong>{student.id} </p>
                                        <p className="text_info"><strong>Name: </strong>{student.name}</p> 
                                        <p className="text_info"> <strong>Email: </strong> {student.email} </p>
                                        <p className="text_info"> <strong>Study Program: </strong>{student.ProgramStudy} </p>
                                        <p className="text_info"> <strong>Study Year: </strong>{student.study_year} </p>
                                        <p className="text_info"> <strong>Have Thesis: </strong>{student.thesis_confirmed} </p>
                                    
                                </div>
                                <div className="button_grp">
                                      
                                        <DeleteOutlineIcon className="DeleteOutlineIcon" onClick={() => Delet_student(student.id)}/>
                                        
                                        
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

                    {selectedList === 'confirmed' && finalList.length > 0 && (
                    <div className="list-container">
                        {finalList.map((conf, index) => (
                        <div key={index} className="list-item">
                            <div className="informations">
                            <p className="text_info"><strong>ID: </strong>{conf.id || 'No id'}</p>
                            <p className="text_info"><strong>Title: </strong>{conf.thesis?.title || 'No title'}</p>
                            <p className="text_info"><strong>Date: </strong>{formatDate(conf.date) || 'No date'}</p>
                            
                            
                            <p className="text_info"><strong>Professor: </strong>{conf.professor?.name || 'No professor'}</p>
            
                            
                            <p className="text_info"><strong>Student Name: </strong>{conf.student?.name || 'No student'}</p>
                           <p className="text_info"><strong>Program study: </strong>{conf.student?.ProgramStudy || 'No program'}</p>

                            
                            </div>
                        
                            <div className="button_grp">
                            <InfoIcon className="InfoIcon" onClick={() => HandleShowInfo(conf)}/>
                            <DeleteOutlineIcon className="DeleteOutlineIcon" onClick={() => HandleDelete_Confirm(conf.id,conf.student.id)}/>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}


                </div>
                <div className="add-button-container">
            <ExitToAppIcon onClick={Logout} className="add_button" />
        </div>
            </div>
        </div>
    );
}
