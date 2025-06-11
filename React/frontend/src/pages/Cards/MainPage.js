import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import "../../page_css/prof_cab.css";
import AddThesis from "./thesis_card.js";
import { AppContext } from "../../components/AppContext.js";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MyConfirmed from "./MyConfiremd_thesis.js";
import AddResponse from "../student-role/Confirmation_card_stud.js";
import MyApplied from "./my_aplies.js";
import Applied from "./applied_students.js";
import Accepted from "../Prof_role/Accepted_Students_card.js";
import MyThesis from "./my_thesis_card.js";
import MyPropouses from "../student-role/MyPropouse.js";
import Propouses from "./propuses_card_prof.js";
import MenuIcon from "@mui/icons-material/Menu";

import BACKEND_URL from "../../server_link.js";
export default function Cabinet() {
    // Get user context values: name, email, login status, and user type
    const { name, email, logined, type } = useContext(AppContext);
    const navigate = useNavigate();

    // State to hold different lists of theses and applications
    const [theses, setTheses] = useState([]);               // Currently displayed theses
    const [allTheses, setAllTheses] = useState([]);         // All theses fetched from backend
    const [allApplications, setAllApplications] = useState([]); // All applications fetched

    // View type state to control what theses/applications to display ("ALL", "Applied", etc.)
    // Defaults to stored value in localStorage or "ALL"
    const [viewType, setViewType] = useState(localStorage.getItem("CardView") || "ALL");

    // List of accepted responses (applications accepted by professor)
    const [acceptedResponses, setAcceptedResponses] = useState([]);

    // Various lists used to categorize theses and applications for different views
    const [AppliedList, setAppliedList] = useState([]);
    const [MyThesisList, setMyThesisList] = useState([]);
    const [AcceptedList, setAccepdedList] = useState([]);
    const [MyAppliedList, setMyAppliedList] = useState([]);
    const [MyResponsedList, setMyResponsedList] = useState([]);
    const [MyConfirmedthesis, setMyConfirmed] = useState([]);
    const [MyPropouse, setMyPropouses] = useState([]);
    const [PropousesList, setPropouses] = useState([]);
    // const[Confirmed,setConfirmed]= useState([]); // commented out unused state

    // States for search filters
    const [searchTitle, setSearchTitle] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [searchProfessor, setSearchProfessor] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");

    // User-related states
    const [id, setId] = useState('');                // user ID
    const [is_confirmed, setConfirmed] = useState('');  // thesis confirmed status
    const [showLeftContainer, setShowLeftContainer] = useState(false); // toggle left container visibility
    const [isVerified, setVerified] = useState('');    // user verification status

    // Function to toggle visibility of the left container in UI
    const toggleLeftContainer = () => {
      setShowLeftContainer(!showLeftContainer);
    };

    // When a thesis card is clicked, save the selected thesis data to localStorage
    const handleClickThesis = (thesis) => {
        localStorage.setItem('selectedThesis', JSON.stringify(thesis));
    };

    // Whenever viewType changes, save the new viewType to localStorage (persists user preference)
    useEffect(() => {
        localStorage.setItem("CardView", viewType);  
    }, [viewType]);

    useEffect(() => {
        // verify if userul is logined or entered
        if (logined || isVerified) { 
            // Fetch all theses
            fetch(`${BACKEND_URL}/prof`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => response.json())
            .then((data) => {
                setTheses(data);
                setAllTheses(data);
                setViewType("ALL");
                // console.log(data);
    
                
                fetch(`${BACKEND_URL}/prof`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                })
                .then((response) => response.json())
                .then((userInfo) => {
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    setId(userInfo.id);
                    setConfirmed(userInfo.thesis_confirmed);
                    setVerified(userInfo.entered);
    
                    // filter theses for user faculty 
                    const filteredTheses = data.filter((thesis) => {
                        return thesis.faculty === userInfo.faculty || thesis.faculty === userInfo.Faculty;
                    });
                    setAllTheses(filteredTheses)
                    setTheses(filteredTheses);
                    setViewType("ALL");
                })
                .catch((error) => console.error("Error fetching user info:", error));
    
                // Fetch all applications
                fetch(`${BACKEND_URL}/applies`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                .then((response) => response.json())
                .then((data) => {
                    setAllApplications(data);
                })
                .catch((error) => console.error("Error fetching applications:", error));
    
            })
            .catch((error) => console.error("Error fetching theses:", error));
        } else {
            // Dacă nu e logat și entered nu e true, nu facem nimic
             console.log("not logined or already valid, whithout fetch.");
        }
    }, [logined, email, isVerified]);
    
    // Navigation handler: go to form for adding new thesis or proposal
    const handleClickAdd = () => navigate('/add_form');

    // Show all theses (reset filter)
    const handleAllClick_All = () => {
        setTheses(allTheses);
        setViewType("ALL");
    };

    // Show theses the logged-in student has applied to
    const handleSeeApplies = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo?.id;

        if (!userInfo) {
            console.error("Student ID not found, userInfo is missing");
            alert("Not logined");
            return;
        }

        // Fetch theses that the student applied to
        fetch(`${BACKEND_URL}/show_My_applies/${studentId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (!response.ok) throw new Error("Error fetching theses");
            return response.json();
        })
        .then((data) => {
            setTheses(data);        // display applied theses
            setAppliedList(data);   // store in applied list
            setViewType("MyApplies"); // update view type accordingly
            console.log('MyApplied List ', AppliedList);
        })
        .catch((error) => console.error("Error fetching theses:", error));

        console.log('MyApplied List ', AppliedList);
    };

    // Show theses that belong to the logged-in professor
    const handleShowMyThesis = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo?.id;

        if (!profId) {
            console.error("User ID not found in localStorage.");
            return;
        }

        // Fetch theses created by the professor
        fetch(`${BACKEND_URL}/show_My_thesis/${profId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
            if (!response.ok) throw new Error("Error fetching theses");
            return response.json();
        })
        .then((data) => {
            setMyThesisList(data);  // set professor's theses list
            setViewType("MyThesis"); // update view
            console.log("My thesis list:", data);
        })
        .catch((error) => console.error("Error fetching theses:", error));
    };

    // Show applications from students that belong to the logged-in professor
    const handleShowApplied = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo?.id;

        if (!profId) {
            console.error("Professor ID not found");
            return;
        }

        // Filter applications to those addressed to the professor
        setTheses(allApplications.filter(application => application.id_prof === profId));
        setMyAppliedList(allApplications.filter(application => application.id_prof === profId));
        // console.log('applies from students ', MyAppliedList);

        setViewType("Applied");  // update view type
    };

    // Show responses (accepted applications) for the logged-in student
    const handleSeeResponses = () => {
        const userInfo = localStorage.getItem('userInfo');

        if (!userInfo) {
            console.error("Student ID not found, userInfo is missing");
            alert("Not logined");
            return;
        }

        const parsedUserInfo = JSON.parse(userInfo);

        if (!parsedUserInfo || !parsedUserInfo.id) {
            console.error("Student ID not found in userInfo");
            return;
        }

        setViewType("response");

        const studentId = parsedUserInfo.id;

        // Fetch accepted responses for student
        fetch(`${BACKEND_URL}/Responses/${studentId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => response.json())
        .then(data => {
            setAcceptedResponses(data);  // store accepted responses
            setMyResponsedList(data);    // also set to MyResponsedList
            // console.log('responses', MyResponsedList);
            setTheses(data);             // display them
        })
        .catch(error => console.error("Error fetching accepted applications:", error));
    };



//  async function hanleSeeThesisConfirmed(){

//         if (!id ) {
//             console.error("Student ID not found in userInfo");
//             alert('Not logined');
//             return;
//         }
//         setViewType("MyChose");
//         console.log('id' ,id);
//         fetch(`http://localhost:8081/confirmedThesis?id_stud=${id}`, {
//             method: "GET",
//             headers: { "Content-Type": "application/json" },
//         })
//         .then(response => response.json())
//         .then(data => {
//             setMyConfirmed(data);
//             console.log('my thesis', data); 
//         })
//         .catch(error => console.error("Error fetching accepted applications:", error));
        
//     }


// Fetch and display the list of accepted theses for the current user (professor/student)
const handleShowAccepted = () => {

    // Check if the user ID is available, else show error and alert
    if (!id ) {
        console.error("Student ID not found in userInfo");
        alert('Not logined');
        return;
    }
    
    // Set the current view type to "Accept" to show accepted theses
    setViewType("Accept");

    const Profid= id;
    // Fetch accepted theses data from backend using the professor's ID
    fetch(`${BACKEND_URL}/Accepted/${Profid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => {
        // Store the accepted theses data in state variables
        setAcceptedResponses(data);
        setAccepdedList(data);
        //console.log('acceptedList',AcceptedList);
        setTheses(data);  
    })
    .catch(error => console.error("Error fetching accepted applications:", error));
};

// Async function to fetch and display the user's own thesis proposals
async function handleMyPropouse() {
    
    // Retrieve user information from local storage
    const userInfo = localStorage.getItem('userInfo');

    // Check if user is logged in
    if (!userInfo) {
        console.error("Student ID not found, userInfo is missing");
        alert("Not logined")
        return;
    }

    try {
        // Fetch proposals from backend using the current user ID
        const response = await fetch(`${BACKEND_URL}/getProposals/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch proposals');
        }

        // Parse the JSON data and update state
        const data = await response.json();
        setMyPropouses(data);
        
    } catch (error) {
        console.error('Error fetching proposals:', error);
    }

    // Log the proposals list to console for debugging
    // console.log('lista my propouse',MyPropouse)

    // Set the view type to display proposals
    setViewType("MyPropouse");
}

// Navigate to the page where user can add a new proposal
function handleMyPropouseAdd(){
    navigate('/MyPropouseAdd');
}

// Search theses based on filters: title, dates, professor, faculty, and program
const handleSearch = () => {
    const filteredTheses = allTheses.filter((thesis) => {
        return (
            (!searchTitle || thesis.title.toLowerCase().includes(searchTitle.toLowerCase())) &&
            (!searchStartDate || new Date(thesis.start_date) >= new Date(searchStartDate)) &&
            (!searchEndDate || new Date(thesis.end_date) <= new Date(searchEndDate)) &&
            (!searchProfessor || thesis.prof_name.toLowerCase().includes(searchProfessor.toLowerCase())) &&
            (!selectedFaculty || thesis.faculty === selectedFaculty) &&
            (!selectedProgram || thesis.study_program === selectedProgram)
        );
    });
    // Set the view to show all filtered theses
    setViewType('ALL');
    setTheses(filteredTheses);
};

// Reset the page by reloading and resetting view and theses list
function handleReset() {
    window.location.reload();
    setViewType('ALL');
    setTheses(theses); 
}

// Async function to fetch and display proposals made by the current user (professor)
async function handleShowPropouses() {
    if (!id) {
        console.error("Student ID not found in userInfo");
        alert("Not logined");
        return;
    }

    try {
        // Fetch proposals from backend filtered by user name
        const response = await fetch(`${BACKEND_URL}/propoused/${name}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and set proposals data to state
        const data = await response.json(); 
        setPropouses(data); 
        // console.log("propused", data); 
        
    } catch (error) {
        console.error("Error fetching accepted applications:", error);
    }
    // Change view to show proposals
    setViewType("Propoused");
}

// Export given data to CSV file with specified filename
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        // Data list is empty, log info and exit
        // console.log('lista goala');
        return;
    } else {
        // Data is available (optional debug)
        // console.log(filename);
    }

    const csvRows = [];

    // Extract headers from object keys and add as CSV header row
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Process each row of data and escape quotes for CSV format
    for (const row of data) {
        const values = headers.map(header => {
            let val = row[header];
            if (typeof val === 'string') {
                val = val.replace(/"/g, '""'); 
            }
            return `"${val}"`;
        });
        csvRows.push(values.join(','));
    }

    // Join all rows into CSV string
    const csvContent = csvRows.join('\n');

    // Create a Blob for CSV data and generate a downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// Export multiple lists to CSV files for download
async function handleExportInfo() {
    exportToCSV(MyAppliedList, "applied_list");
    exportToCSV(PropousesList, "propouse_list");
    exportToCSV(AcceptedList, "accepted_list");
    exportToCSV(MyConfirmedthesis, "confirmed_list"); 
}

// Fetch and display theses confirmed by the current professor/user
async function handleShowConfirmed() {

    // Check if user ID is present, else alert and stop
    if (!id ) {
        console.error("{Professor} ID not found in userInfo");
        alert('Not logined');
        return;
    }
  
    // Set view type to show chosen/confirmed theses
    setViewType("MyChose");
   
    // Fetch confirmed theses from backend using professor ID
    fetch(`${BACKEND_URL}/confirmed?id_prof=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => {
        // Update state with confirmed theses data
        // setConfirmed(data);
        setMyConfirmed(data);
        // console.log('my thesis', data); 
    })
    .catch(error => console.error("Error fetching accepted applications:", error));
}

// Navigate to student chat page
function handelGoToChat() {
    navigate('/Student_chat');
}

// Utility function to get a shortened version of description (max 100 chars)
const getShortDescription = (desc) => (desc ? `${desc.substring(0, 100)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <div className="body_prof">
         <div className={`menu_icon ${showLeftContainer ? "visible" : "hidden"}`}>
        <MenuIcon onClick={toggleLeftContainer} style={{ cursor: "pointer" }} />
        </div>
         <div className={`left_container ${showLeftContainer ? "visible" : "hidden"}`}>
        <h3 className="section_title">Search Thesis</h3>
       
        <label className="search_label_top">Title</label>

        <input
                    type="text"
                    className="search_input_text"
                    placeholder="Caută după titlu..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
             <label className="search_label">Date interval</label>
                <input
                    type="date"
                    className="date_input"
                    placeholder="Data Start"
                    value={searchStartDate}
                    onChange={(e) => setSearchStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="date_input_end"
                    placeholder="Data End"
                    value={searchEndDate}
                    onChange={(e) => setSearchEndDate(e.target.value)}
                />
                 <label className="search_label">Profesor</label>
                <input
                    type="text"
                    className="search_input"
                    placeholder="Caută după profesor..."
                    value={searchProfessor}
                    onChange={(e) => setSearchProfessor(e.target.value)}
                    />
            
        <button className="search_button" onClick={handleSearch}>Caută</button>
        <button className="search_button" onClick={handleReset}>Reset</button>

    </div>
        <div className={`right_container ${showLeftContainer ? "default" : "full-width"}`}>
        <div className={`top_container ${showLeftContainer ? "default" : "full-width"}`}>
        <div className="button-group">
                        {type === "professor" ? (
                            <>
                                    <button onClick={handleAllClick_All}>All</button>
                                    <button onClick={handleShowMyThesis}>MyTheses</button>
                                    <button onClick={handleShowApplied}>Applied</button>
                                    <button onClick={handleShowPropouses}>Proposed</button>
                                    <button onClick={handleShowAccepted}>Accepted</button>
                                    <button onClick={handleShowConfirmed}>Confirmed</button>
                                                                </>
                        ) : (
                            <>
                                {is_confirmed === 1 ? (
                                    <>
                                        <button onClick={handleAllClick_All}>ALL</button>
                                        <button onClick={handelGoToChat}>MyThesis</button>
                                    </>
                                ) : (
                                    <>
                                       <button onClick={handleAllClick_All}>All</button>
                                        <button onClick={handleMyPropouse}>MyProposals</button>
                                        <button onClick={handleSeeApplies}>MyApplications</button>
                                        <button onClick={handleSeeResponses}>Responses</button>

                                    </>
                                )}
                            </>
                        )}
                    </div>

                </div>
              
                <div className={`bottom_container ${showLeftContainer ? "default" : "full-width"}`}>
                {
  viewType === "ALL" && theses.length > 0 ? (
    theses.map((thesis) => (
      <AddThesis
        key={thesis.id}
        onClick={(e) => {
          e.stopPropagation();
          handleClickThesis(thesis);
          navigate('/thesisinfo');
        }}
       
        thesisName={thesis.title}
        date_start={thesis.start_date}
        date_end={thesis.end_date}
        faculty={thesis.faculty}
        study_program={thesis.study_program}
        description={getShortDescription(thesis.description)}
        requirements={getShortDescription(thesis.requirements)}
        professor_name={thesis.prof_name}
        viewType={viewType}
        id={thesis.id}
      />
    ))
  ) : viewType === "response" && MyResponsedList.length > 0 ? (
    MyResponsedList.map((respons) => (
      <AddResponse
        key={respons.id}
        id_thesis={respons.id_thesis}
        id_prof={respons.id_prof}
        id_stud={respons.stud_id}
        thesisName={respons.title}
        data={respons.data}
        faculty={respons.faculty}
        stud_email={respons.stud_email}
        prof_name={respons.prof_name}
        student_name={respons.stud_name}
        professor_name={respons.prof_name}
        prof_email={respons.prof_email}
        id={respons.id}
        cover_letter={respons.cover_letter}
      />
    ))
  ) : viewType === "MyApplies" && AppliedList.length > 0 ? (
    AppliedList.map((aply) => (
      <MyApplied
        key={aply.id}
        thesisName={aply.title}
        study_year={aply.study_year}
        faculty={aply.faculty}
        study_program={aply.study_program}
        applied_data={aply.applied_data}
        stud_name={aply.stud_name}
        prof_email={aply.prof_email}
        professor_name={aply.prof_name}
        professor_id={aply.id_prof}
        viewType={viewType}
        id={aply.id}
      />
    ))
  ) : viewType === "Applied" && MyAppliedList.length > 0 ? (
    MyAppliedList.map((aply) => (
      <Applied
        key={aply.id}
        thesisName={aply.title}
        applied_data={aply.applied_data}
        faculty={aply.faculty}
        study_program={aply.study_program}
        student_program={aply.student_program}
        stud_email={aply.stud_email}
        stud_name={aply.stud_name}
        professor_name={aply.prof_name}
        stud_id={aply.id_stud}
        viewType={viewType}
        study_year={aply.study_year}
        id={aply.id}
      />
    ))
  ) : viewType === "Accept" && AcceptedList.length > 0 ? (
    AcceptedList.map((aply) => (
      <Accepted
        key={aply.id}
        thesisName={aply.title}
        applied_data={aply.data}
        faculty={aply.faculty}
        study_program={aply.study_program}
        student_program={aply.student_program}
        stud_email={aply.stud_email}
        stud_name={aply.stud_name}
        professor_name={aply.prof_name}
        viewType={viewType}
        id={aply.id}
      />
    ))
  ) : viewType === "MyThesis" && MyThesisList.length > 0 ? (
    MyThesisList.map((aply) => (
      <MyThesis
        key={aply.id}
        thesisName={aply.title}
        date_start={aply.start_date}
        date_end={aply.end_date}
        faculty={aply.faculty}
        study_program={aply.study_program}
        student_program={aply.student_program}
        stud_email={aply.stud_email}
        stud_name={aply.stud_name}
        professor_name={aply.prof_name}
        viewType={viewType}
        id={aply.id}
        state={aply.state}
      />
    ))
  ) : viewType === "MyChose" && MyConfirmedthesis.length > 0 ? (
    MyConfirmedthesis.map((aply) => (
      <MyConfirmed
        key={aply.id}
         id={aply.id}
         id_prof={aply.id_prof}
         id_thesis={aply.id_thesis}
         date={aply.date}
         id_stud={aply.id_stud}
         origin={aply.origin}
       
      />
    ))
  ): viewType === "MyPropouse" && MyPropouse.length > 0 ? (
    MyPropouse.map((application) => (
       
        <MyPropouses
        key={application.id}
        thesisName={application.title}
        professor_name={application.prof_name}
        professor_id={application.prof_id}
       
        applied_data={application.date} 
        description={application.description}
        state = {application.state}
        id={application.id}
    />
       
    ))
  ) : viewType === "Propoused" && PropousesList.length > 0 ? (
    PropousesList.map((application) => (
            <Propouses
            key={application.id}
            thesisName={application.title}
            professor_name={application.prof_name}
            professor_id={application.prof_id}
            stud_name={application.stud_name}
            stud_email={application.stud_email}
            applied_data={application.date} 
            stud_id={application.stud_id}
            description={application.description}
            state={application.state}
            study_program={application.study_program}
            faculty={application.faculty}
            id={application.id}
            />
       
    ))
) :  (
    <p style={{ color: "#333" }}>No available content for this link</p> 
   
   
  )
}


    {type === "professor" && isVerified == 1 && (
        <>
        <div className='export_info'>
            <SystemUpdateAltIcon onClick={handleExportInfo} className="export_button"/>
        </div>
        <div className="add-button-container">
            <AddCircleOutlineIcon onClick={handleClickAdd} className="add_button" />
        </div>
        </>
    )}
    {viewType === "MyPropouse" && (
        <div className="add-button-container">
            <AddCircleOutlineIcon onClick={handleMyPropouseAdd} className="add_button" />
        </div>
    )}

</div>
            </div>
        </div>
    );
}