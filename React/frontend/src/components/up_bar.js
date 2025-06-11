import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../page_css/UpBar.css";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import PersonalForm from "./personal_cabinet";
import Logo from "../images/Logo-UVT-2017-02.ico";
import { AppContext } from "./AppContext";
import BACKEND_URL from "../server_link";

// Helper function to return appropriate aria-label text based on notification count
function notificationsLabel(count) {
    if (count === 0) {
        return 'no notifications'; // No notifications case
    }
    if (count > 99) {
        return 'more than 99 notifications'; // Cap display at 99+
    }
    return `${count} notifications`; // Default case: show exact count
}

function UpBar() {
    // Get login state from global context
    const { logined } = useContext(AppContext);

    // State for showing/hiding the personal form
    const [showForm, setShowForm] = useState(false);
    // State for number of favorite items to display on badge
    const [favoriteCount, setFavoriteCount] = useState(0);
    // React Router's navigate function to programmatically change routes
    const navigate = useNavigate();

    // Handler to show the personal form
    const handleClickForm = () => {
        setShowForm(true);
    };

    // Handler to navigate to the main "prof" page when logo is clicked
    const handleLogoClick = () => {
        navigate('/prof');
    };

    // Effect to fetch favorite count whenever login state changes
    useEffect(() => {
        if (logined) {
            // Parse user info from localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // Only proceed if user ID is available
            if (userInfo && userInfo.id) {
                const fetchFavorites = async () => {
                    try {
                        // Fetch favorite count from backend API
                        const response = await fetch(
                            `${BACKEND_URL}/count?userId=${userInfo.id}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );
                        // Check for HTTP response errors
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        // Parse JSON result and update favorite count state
                        const result = await response.json();
                        setFavoriteCount(result.count);
                    } catch (error) {
                        // On error, log it and reset count to zero
                        console.error('Error fetching favorite count:', error);
                        setFavoriteCount(0);
                    }
                };

                fetchFavorites();
            }
        } else {
            // If not logged in, reset favorite count to zero
            setFavoriteCount(0);
        }
    }, [logined]); // Dependency array - runs when login status changes

    // Navigate to favorites page when favorite icon is clicked
    function ShowFavorite() {
        navigate('/favorite');
    }

    // Navigate to main "prof" page (currently unused in UI)
    function goMain() {
        navigate('/prof');
    }

    // Effect to auto-hide the personal form 2.2 seconds after it is shown
    useEffect(() => {
        if (showForm) {
            const timer = setTimeout(() => {
                setShowForm(false);
            }, 2200); // 2200 ms delay before hiding form
            return () => clearTimeout(timer); // Cleanup timeout on unmount or dependency change
        }
    }, [showForm]); // Runs when showForm state changes

    // JSX rendering the top bar UI
    return (
        <div className="upbar">
            {/* Logo button - clicking navigates to /prof */}
            <IconButton className="logo_box" onClick={handleLogoClick}>
                <img src={Logo} alt="Logo" className="logo" />
            </IconButton>

            {/* Favorite icon button with badge showing favorite count */}
            <IconButton aria-label={notificationsLabel(favoriteCount)} className="liked_icon" onClick={ShowFavorite}>
                <Badge
                    badgeContent={favoriteCount}
                    color="secondary"
                    overlap="circular"
                    sx={{
                        '.MuiBadge-dot': {
                            backgroundColor: 'white'
                        },
                        '.MuiBadge-badge': {
                            right: 25,
                            top: 3,
                            backgroundColor: 'white',
                            color: 'black'
                        }
                    }}
                >
                    <FavoriteBorderIcon className='icon' />
                </Badge>
            </IconButton>

            {/* Personal account icon button that toggles the personal form */}
            <div item>
                <IconButton onClick={handleClickForm} className="personal_icon">
                    <AccountBoxIcon className='icon' />
                </IconButton>
            </div>

            {/* Conditionally render PersonalForm component when showForm is true */}
            {showForm && <PersonalForm />}
        </div>
    );
}

export default UpBar;
