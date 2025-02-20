import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./AppContext";
import  "../page_css/Favorite_page.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router";

export default function Favorite() {
    const [favoriteIds, setFavoriteIds] = useState([]); 
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const { logined } = useContext(AppContext);

    useEffect(() => {
        if (logined) {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const userId = userInfo?.id;

            if (!userId) {
                setError("User ID is missing");
                setLoading(false);
                return;
            }

            
            fetch(`http://localhost:8081/Favorites/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(favorites => {
                    setFavoriteIds(favorites.map(fav => fav.id_thesis)); 
                })
                .catch(error => {
                    console.error("Error fetching favorites:", error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [logined]);
  
    useEffect(() => {
        if (favoriteIds.length > 0) {
            
            Promise.all(
                favoriteIds.map(id_thesis =>
                    fetch(`http://localhost:8081/ThesisDetails/${id_thesis}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .catch(error => {
                            console.error(`Error fetching thesis with ID ${id_thesis}:`, error);
                            return null; 
                        })
                )
            )
                .then(thesisData => {
                    setData(thesisData.filter(Boolean));
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching thesis details:", error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [favoriteIds]);

    // if (loading) {
    //     return <p>Loading...</p>;
    // }

    const handleBack = () => {
        navigate("/prof");
    };
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="favorites-container">
             <button type="button" className="back_button" onClick={handleBack}>
                            <ArrowBackIcon  className="arrow"/>
                        </button>
            <div className="m_container">
                {data.length === 0 ? (
                    
                    <p className="not_found">No favorites found.</p>
                   
                ) : (
                    data.map((item, index) => (
                        <FavoriteCard key={index} item={item} />
                    ))
                )}
            </div>
          
        </div>
    );
}

function FavoriteCard({ item }) {
    const { title, description, faculty, prof_name, id, study_program, state } = item;
    const [userInfo, setUserInfo] = useState(null);
   
    async function handleRemove(e) {
        e.preventDefault();
    
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
            console.error("User info missing from localStorage.");
            return;
        }
    
        const userInfo = JSON.parse(storedUserInfo);
    
        try {
            const response = await fetch('http://localhost:8081/fav', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userInfo.id,
                    thesisId: id,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Șters cu succes din favorite:', result);
        } catch (error) {
            console.error('Eroare în timpul ștergerii din favorite:', error);
        }
        window.location.reload();
    }
    
   

   
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 100)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <form className="applied_form">
            <p className="text title">Title: {title || "No title"}</p>
            <p className="text">Description: {getShortDescription(description) || "No description"}</p>
            <p className="text">Faculty: {faculty || "No faculty"}</p>
            <p className="text">Professor: {prof_name || "No professor"}</p>
            <p className="text">Study Program: {study_program || "No study program"}</p>
            <p className="text">State: {state || "No state"}</p>
            <button className="withdraw_btn" onClick={handleRemove}>Remove</button>
            
        </form>
    );
}
