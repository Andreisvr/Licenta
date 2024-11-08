import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/prof_cab.css';
import AddThesis from "./thesis_card.js";
import { AppContext } from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/AppContext.js';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import AddResponse from "./responsed_card.js";
import MyApplied from "./my_aplies.js";
import Applied from "./applied_students.js";
import Accepted from "./accepted_thesis.js";
import MyThesis from "./my_thesis_card.js";


export default function Cabinet() {
    const { name, email, logined, type } = useContext(AppContext);
    const navigate = useNavigate();
    const [theses, setTheses] = useState([]);
    const [allTheses, setAllTheses] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [viewType, setViewType] = useState("ALL");
    const [acceptedResponses, setAcceptedResponses] = useState([]);

    const[AppliedList,setAppliedList] = useState([]);
    const[MyThesisList,setMyThesisList] = useState([]);
    const[AcceptedList,setAccepdedList] = useState([]);

    const[MyAppliedList,setMyAppliedList] = useState([]);
    const[MyResponsedList,setMyResponsedList] = useState([]);

    const [id,setId] = useState('');
    const handleClickThesis = (thesis) => {
        localStorage.setItem('selectedThesis', JSON.stringify(thesis));
        
    };

  
    useEffect(() => {
        fetch("http://localhost:8081/prof", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then((response) => response.json())
        .then((data) => {
            setTheses(data);
            setAllTheses(data);
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
               
                console.log('user info', userInfo);
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


    useEffect(() => {
        if (id && allTheses.length > 0 && allApplications.length > 0) {
            handleShowMyThesis();
            handleShowApplied();
            handleShowAccepted();
            handleSeeApplies();
            handleSeeResponses();
           
        }
    }, [id, allTheses, allApplications]);


    const handleClickAdd = () => navigate('/add_form');

    const handleAllClick_All = () => {
        setTheses(allTheses);
        setViewType("ALL");
    };

    const handleSeeApplies = () => {
        setViewType("MyApplies");
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo?.id;

        if (!studentId) {
            // console.error("Student ID not found");
            //alert("Not Logined")
            return;
        }

        const matchedTheses = allTheses.filter(thesis =>
            allApplications.some(application => application.id_thesis === thesis.id && application.id_stud === studentId)
        );
        setTheses(matchedTheses);
        setAppliedList(matchedTheses);
        console.log('MyAplied List ',AppliedList);

        setViewType("MyApplies");
    };

    const handleWithdraw = (id) => {
        fetch(`http://localhost:8081/prof/${id}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to withdraw thesis");
            setTheses(prevTheses => prevTheses.filter(thesis => thesis.id !== id));
        })
        .catch(error => console.error("Error withdrawing thesis:", error));
        window.location.reload();
    };

    const handleShowMyThesis = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const profId = userInfo?.id;
        setTheses(allTheses.filter(thesis => thesis.prof_id === profId));
        
        setMyThesisList(allTheses.filter(thesis => thesis.prof_id === profId));
        console.log('my thesis',MyThesisList);
        
        setViewType("MyThesis");
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
        //console.log('my aplies',MyAppliedList);

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
           // console.log('responses',MyResponsedList);
            setTheses(data);  
        })
        .catch(error => console.error("Error fetching accepted applications:", error));
    };
    



    const handleShowAccepted = () => {


       
        if (!id ) {
            console.error("Student ID not found in userInfo");
            alert('Not logined');
            return;
        }
        setViewType("Accept");
    
       
        console.log(id);
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

  
    
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 100)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <div className="body_prof">
            <div className="left_container"></div>
            <div className="right_container">
                <div className="top_container">
                    <div className="button-group">
                        {type === "professor" ? (
                            <>
                                <button onClick={handleAllClick_All}>ALL</button>
                                <button onClick={handleShowMyThesis}>MyThesis</button>
                                <button onClick={handleShowApplied}>Applied</button>
                                <button onClick={handleShowAccepted}>Accepted</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleAllClick_All}>ALL</button>
                                <button>MyPropose</button>
                                <button onClick={handleSeeApplies}>MyApplies</button>
                                <button onClick={handleSeeResponses}>Responsed</button>
                            </>
                        )}
                    </div>
                    <div className="icon-container">
                        {type === "professor" ? <PersonIcon className="icon" /> : <SchoolIcon className="icon" />}
                    </div>
                </div>
               
                <div className="bottom_container">
    {viewType === "ALL" && theses.map((thesis) =>(
        <AddThesis
            key={thesis.id}
            onClick={(e) => {
                e.stopPropagation();
                handleClickThesis(thesis);
                navigate('/thesisinfo');
            }}
            onWithdraw={() => handleWithdraw(thesis.id)}
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
    ))}

    {viewType === "response" && MyResponsedList.map((respons) => (
        <AddResponse
            key={respons.id}
           
         
            thesisName={respons.title}
            data={respons.data}
            faculty={respons.faculty}
            study_program={respons.stud_program}
            student_name={respons.stud_name}
            professor_name={respons.prof_name}
            viewType={viewType}
            id={respons.id}
        />
    ))}

{viewType === "MyApplies" && AppliedList.length > 0 && AppliedList.map((aply) => (
        <MyApplied
            key={aply.id}
           
            thesisName={aply.title}
            date_start={aply.start_date}
            date_end={aply.end_date}
            faculty={aply.faculty}
            study_program={aply.study_program}
            stud_name={aply.stud_name}
            professor_name={aply.prof_name}
            viewType={viewType}
            id={aply.id}
            
        />
    ))}


    {viewType === "Applied" && MyAppliedList.length > 0 && MyAppliedList.map((aply) => (
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
            id={aply.id}
            
        />
    ))}

    {viewType === "Accept" && AcceptedList.length > 0 && AcceptedList.map((aply) => (
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
    ))}

{viewType === "MyThesis" && MyThesisList.length > 0 && MyThesisList.map((aply) => (
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
            
        />
    ))}
    {type === "professor" && (
        <div className="add-button-container">
            <AddCircleOutlineIcon onClick={handleClickAdd} className="add_button" />
        </div>
    )}
</div>
            </div>
        </div>
    );
}