import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../page_css/UpBar.css";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import PersonalForm from "./personal_cabinet";
import Logo from "../images/Logo-UVT-2017-02.ico";
import BACKEND_URL from "../server_link";

import { AppContext } from "./AppContext";

// Helper function to create accessible notification labels based on count
function notificationsLabel(count) {
    if (count === 0) {
        return 'no notifications';  // No notifications case
    }
    if (count > 99) {
        return 'more than 99 notifications';  // Cap label for large counts
    }
    return `${count} notifications`;  // Regular count label
}

function UpBar_Log() {
    // Access login state from global context
    const { logined } = useContext(AppContext);

    // Local state for showing the personal form and favorite count badge
    const [showForm, setShowForm] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);

    // React Router navigation hook
    const navigate = useNavigate();

    // Show personal form when user icon is clicked
    const handleClickForm = () => {
        setShowForm(true);
    };

    // Navigate to '/prof' page when logo is clicked
    const handleLogoClick = () => {
        navigate('/prof');
    };

    // Effect to fetch favorite count when user is logged in
    useEffect(() => {
        if (logined) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.id) {
                const fetchFavorites = async () => {
                    try {
                        // Call backend API to get count of favorites for user
                        const response = await fetch(
                            `${BACKEND_URL}/count?userId=${userInfo.id}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const result = await response.json();
                        setFavoriteCount(result.count);  // Update favorite count state
                    } catch (error) {
                        console.error('Error fetching favorite count:', error);
                        setFavoriteCount(0);  // Reset count on error
                    }
                };

                fetchFavorites();
            }
        } else {
            setFavoriteCount(0);  // Reset count if not logged in
        }
    }, [logined]);

    // Navigate to favorites page when favorite icon is clicked
    function ShowFavorite() {
        navigate('/favorite');
    }

    // Navigate to main '/prof' page (currently unused)
    function goMain() {
        navigate('/prof');
    }

    // Effect to auto-hide the personal form after 2200ms when shown
    useEffect(() => {
        if (showForm) {
            const timer = setTimeout(() => {
                setShowForm(false);
            }, 2200); 
            return () => clearTimeout(timer);  // Clear timeout on unmount or re-run
        }
    }, [showForm]);

    return (
        <div className="upbar-log">
            {/* Logo button navigating to '/prof' */}
            <IconButton className="logo_box" onClick={handleLogoClick}>
                <img src={Logo} alt="Logo" className="logo" />
            </IconButton>

            {/* Favorite icon button with badge showing count */}
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
                    <FavoriteBorderIcon className='icon_login' />
                </Badge>
            </IconButton>

            {/* Personal icon button to show personal form */}
            <div item>
                <IconButton onClick={handleClickForm} className="personal_icon">
                    <AccountBoxIcon className='icon_login' />
                </IconButton>
            </div>

            {/* Conditionally render personal form */}
            {showForm && <PersonalForm />}
        </div>
    );
}

export default UpBar_Log;
