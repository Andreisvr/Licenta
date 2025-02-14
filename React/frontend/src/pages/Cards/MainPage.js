import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/prof_cab.css';
import AddThesis from "./thesis_card.js";
import { AppContext } from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/AppContext.js';

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


export default function Cabinet() {
    const { name,email, logined, type } = useContext(AppContext);
    const navigate = useNavigate();
    const [theses, setTheses] = useState([]);
    const [allTheses, setAllTheses] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    
    const [viewType, setViewType] = useState(localStorage.getItem("CardView") || "ALL");

    const [acceptedResponses, setAcceptedResponses] = useState([]);
   
       
    //listele de date pentru cards 
    const[AppliedList,setAppliedList] = useState([]);
    const[MyThesisList,setMyThesisList] = useState([]);
    const[AcceptedList,setAccepdedList] = useState([]);
    const[MyAppliedList,setMyAppliedList] = useState([]);
    const[MyResponsedList,setMyResponsedList] = useState([]);
    const [MyConfirmedthesis,setMyConfirmed] = useState([]);
    const[MyPropouse,setMyPropouses]= useState([]);
    const[PropousesList,setPropouses]= useState([]);
    // const[Confirmed,setConfirmed]= useState([]);
   
    const [searchTitle, setSearchTitle] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [searchProfessor, setSearchProfessor] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");


    const [id,setId] = useState('');
    const [is_confirmed,setConfirmed] = useState('');
    const [showLeftContainer, setShowLeftContainer] = useState(false); 
    const [isVerified,setVerified] = useState('');

    const toggleLeftContainer = () => {
      setShowLeftContainer(!showLeftContainer);
    };


    const handleClickThesis = (thesis) => {
        localStorage.setItem('selectedThesis', JSON.stringify(thesis));
        
    };
    
    useEffect(() => {
        localStorage.setItem("CardView", viewType);  
      
       

    }, [viewType]);

  
    useEffect(() => {
        fetch("http://localhost:8081/prof", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => response.json())
        .then((data) => {
            setTheses(data);

           
            setAllTheses(data);
            
           
                setViewType("ALL");  
           

        })
        .catch((error) => console.error("Error fetching theses:", error));

        if (logined) {
            fetch("http://localhost:8081/prof", {
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
                //console.log('user info', userInfo);
            })
            .catch((error) => console.error("Error fetching user info:", error));

            fetch("http://localhost:8081/applies", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => response.json())
            .then((data) => {
                setAllApplications(data);
               
              
                
            })
            .catch((error) => console.error("Error fetching applications:", error));
        }
    
    }, [logined, email]);


   

    const handleClickAdd = () => navigate('/add_form');

    const handleAllClick_All = () => {
        setTheses(allTheses);
        setViewType("ALL");
    };

    const handleSeeApplies = () => {

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo?.id;

        if (!userInfo) {
            console.error("Student ID not found, userInfo is missing");
            alert("Not logined")
            return;
        }
        fetch(`http://localhost:8081/show_My_applies/${studentId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error fetching theses");
                }
                return response.json();
            })
            .then((data) => {
          
                setTheses(data);
                setAppliedList(data);
                setViewType("MyApplies");
                console.log('MyAplied List ',AppliedList);
        
            })
            .catch((error) => console.error("Error fetching theses:", error));
       
        console.log('MyAplied List ',AppliedList);
        
       
    };



    const handleShowMyThesis = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo?.id;
    
        if (!profId) {
            console.error("User ID not found in localStorage.");
            return;
        }
    
        fetch(`http://localhost:8081/show_My_thesis/${profId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error fetching theses");
                }
                return response.json();
            })
            .then((data) => {
                setMyThesisList(data); 
                setViewType("MyThesis"); 
                console.log("My thesis list:", data);
            })
            .catch((error) => console.error("Error fetching theses:", error));
    };
    

    const handleShowApplied = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo?.id;

        if (!profId) {
            console.error("Professor ID not found");
            return;
        }

        setTheses(allApplications.filter(application => application.id_prof === profId));
        setMyAppliedList(allApplications.filter(application => application.id_prof === profId));
        console.log('aplies from students ',MyAppliedList);
       
        setViewType("Applied");
    };

    const handleSeeResponses = () => {
       
       
        const userInfo = localStorage.getItem('userInfo');
        
        if (!userInfo) {
            console.error("Student ID not found, userInfo is missing");
            alert("Not logined")
            return;
        }
        const parsedUserInfo = JSON.parse(userInfo);

        if (!parsedUserInfo || !parsedUserInfo.id) {
            console.error("Student ID not found in userInfo");
            //alert('Not logined');
            return;
        }
        setViewType("response");

    
        const studentId = parsedUserInfo.id; 
       
        fetch(`http://localhost:8081/Responses/${studentId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => response.json())
        .then(data => {
            setAcceptedResponses(data);
            setMyResponsedList(data);
           console.log('responses',MyResponsedList);
            setTheses(data);  
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



    const handleShowAccepted = () => {

       
        if (!id ) {
            console.error("Student ID not found in userInfo");
            alert('Not logined');
            return;
        }
        setViewType("Accept");
    
       
       
       const Profid= id;
        fetch(`http://localhost:8081/Accepted/${Profid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => response.json())
        .then(data => {
            setAcceptedResponses(data);
            setAccepdedList(data);
            //console.log('acceptedList',AcceptedList);
            setTheses(data);  
        })
        .catch(error => console.error("Error fetching accepted applications:", error));
    };

   async function handleMyPropouse()
        {
           
            const userInfo = localStorage.getItem('userInfo');
        
            if (!userInfo) {
                console.error("Student ID not found, userInfo is missing");
                alert("Not logined")
                return;
            }

           
            try {
                const response = await fetch(`http://localhost:8081/getProposals/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch proposals');
                }
    
                const data = await response.json();
                setMyPropouses(data);
                
            } catch (error) {
                console.error('Error fetching proposals:', error);
            }
        
        console.log('lista my propouse',MyPropouse)

        setViewType("MyPropouse");
        
    }


    function handleMyPropouseAdd(){

            navigate('/MyPropouseAdd');

        }

    const handleSelection = (faculty, program) => {
        setSelectedFaculty(faculty);
        setSelectedProgram(program);
    };
    

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
        setViewType('ALL');
        setTheses(filteredTheses);
    };
    
    function handleReset() {
       
       window.location.reload();
        
        setViewType('ALL');
        setTheses(theses); 
    }


    async function handleShowPropouses() {
        if (!id) {
            console.error("Student ID not found in userInfo");
            alert("Not logined");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8081/propoused/${name}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json(); 
            setPropouses(data); 
            console.log("propused", data); 
            
        } catch (error) {
            console.error("Error fetching accepted applications:", error);
        }
        setViewType("Propoused");
    }
    

    async function handleShowConfirmed() {

        if (!id ) {
            console.error("{Professor} ID not found in userInfo");
            alert('Not logined');
            return;
        }
      
        setViewType("MyChose");
       
        fetch(`http://localhost:8081/confirmed?id_prof=${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => response.json())
        .then(data => {
            // setConfirmed(data);
            
            
            setMyConfirmed(data);
            console.log('my thesis', data); 
        })
        .catch(error => console.error("Error fetching accepted applications:", error));
        
        
    }
    function handelGoToChat()
    {
        navigate('/Student_chat');
    }



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
        <button className="search_button" onClick={handleReset}>Rest</button>

    </div>
        <div className={`right_container ${showLeftContainer ? "default" : "full-width"}`}>
        <div className={`top_container ${showLeftContainer ? "default" : "full-width"}`}>
        <div className="button-group">
                        {type === "professor" ? (
                            <>
                                <button onClick={handleAllClick_All}>ALL</button>
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
                                        <button onClick={handleAllClick_All}>ALL</button>
                                        <button onClick={handleMyPropouse}>MyPropose</button>
                                        <button onClick={handleSeeApplies}>MyApplies</button>
                                        <button onClick={handleSeeResponses}>Responsed</button>
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
        study_program={respons.stud_program}
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
        professor_id={application.professor_id}
       
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
        <div className="add-button-container">
            <AddCircleOutlineIcon onClick={handleClickAdd} className="add_button" />
        </div>
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