import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./AppContext";
import  "../page_css/Favorite_page.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useNavigate } from "react-router";
import BACKEND_URL from "../server_link";


export default function Favorite() {
    const [favoriteIds, setFavoriteIds] = useState([]); 
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const { logined } = useContext(AppContext);
   


    // Fetch favorite thesis IDs when user is logged in
    
    useEffect(() => {
        if (logined) {
            // Get user info from localStorage
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const userId = userInfo?.id;

            if (!userId) {
                setError("User ID is missing");
                setLoading(false);
                return;
            }
           
            // Fetch favorite thesis IDs for the current user
            fetch(`${BACKEND_URL}/Favorites/${userId}`, {
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
                    // Extract and store thesis IDs from favorites
                    setFavoriteIds(favorites.map(fav => fav.id_thesis)); 
                })
                .catch(error => {
                    console.error("Error fetching favorites:", error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [logined]);
  
    // Fetch detailed data for each favorite thesis ID
    useEffect(() => {
        if (favoriteIds.length > 0) {
            
            Promise.all(
                favoriteIds.map(id_thesis =>
                    fetch(`${BACKEND_URL}/ThesisDetails/${id_thesis}`, {
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
                    // Filter out any null responses and update state
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

    // Navigate back to /prof page
    const handleBack = () => {
        navigate("/prof");
    };

    // Show error message if error occurs
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
                    // Display message if no favorites found
                    <p className="not_found">No favorites found.</p>
                ) : (
                    // Map through fetched favorite thesis data and render FavoriteCard components
                    data.map((item, index) => (
                        <FavoriteCard key={index} item={item} />
                    ))
                )}
            </div>
        </div>
    );
}

function FavoriteCard({ item }) {
    // useNavigate hook for navigation
    const navigate = useNavigate(); 
    
    // Handler to remove a thesis from favorites
    async function handleRemove(e) {
        e.preventDefault();
    
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
            console.error("User info missing from localStorage.");
            return;
        }
    
        const userInfo = JSON.parse(storedUserInfo);
    
        try {
            // Send DELETE request to remove favorite
            const response = await fetch(`${BACKEND_URL}/fav`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userInfo.id,
                    thesisId: item.id,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Successfully removed from favorites:', result);
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
        // Small delay before reloading page to reflect changes
        await new Promise((resolve) => setTimeout(resolve, 350));

        window.location.reload();
        //navigate('/prof');
    }
    
    // Handler to show thesis details and store selected thesis in localStorage
    function ShowThesis()
    {
        localStorage.setItem('selectedThesis', JSON.stringify(item));
        // console.log(item);
        navigate('/thesisinfo')
    }

    // Helper to shorten the description text
    const getShortDescription = (desc) => (desc ? `${desc.substring(0, 100)}${desc.length > 100 ? "..." : ""}` : "");

    return (
        <form className="applied_form" onClick={ShowThesis}>
            <p className="text title">Title: {item.title || "No title"}</p>
            <p className="text">Description: {getShortDescription(item.description) || "No description"}</p>
            <p className="text">Faculty: {item.faculty || "No faculty"}</p>
            <p className="text">Professor: {item.prof_name || "No professor"}</p>
            <p className="text">Study Program: {item.study_program || "No study program"}</p>
            <p className="text">State: {item.state || "No state"}</p>
            <button className="withdraw_btn" onClick={handleRemove}>Remove</button>
        </form>
    );
}
