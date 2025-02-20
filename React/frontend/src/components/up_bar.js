import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../page_css/UpBar.css"
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import PersonalForm from "./personal_cabinet";
import  Logo from  "../images/Logo-UVT-2017-02.ico";
import { AppContext } from "./AppContext";

function notificationsLabel(count) {
    if (count === 0) {
        return 'no notifications';
    }
    if (count > 99) {
        return 'more than 99 notifications';
    }
    return `${count} notifications`;
}

function UpBar() {

const {  logined} = useContext(AppContext);

    const [showForm, setShowForm] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0); 
    const navigate = useNavigate();

    
    const handleClickForm = () => {
        setShowForm(!showForm);
    };

    
    const handleLogoClick = () => {
        navigate('/prof');
    };
    //console.log('logaat',logined);
    
    useEffect(() => {
        if (logined) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.id) {
                const fetchFavorites = async () => {
                    try {
                        const response = await fetch(
                            `http://localhost:8081/count?userId=${userInfo.id}`, 
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
                        
                        setFavoriteCount(result.count);  
                    } catch (error) {
                        console.error('Error fetching favorite count:', error);
                        setFavoriteCount(0); 
                    }
                };

                fetchFavorites();
               
            }
        } else {
            setFavoriteCount(0); 
        }
       
    }, [logined]); 

    function ShowFavorite()
    {
        navigate('/favorite')
    }
    function goMain()
    {
        navigate('/prof')
    }
    return (
        <div className="upbar">
           
            <IconButton className="logo_box" onClick={handleLogoClick}>
                <img src={Logo} alt="Logo" className="logo" />
            </IconButton>
            {/* <button onClick={goMain} >Main</button> */}
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
            
            <div item>
                <IconButton onClick={handleClickForm} className="personal_icon">
                    <AccountBoxIcon className='icon' />
                </IconButton>
            </div>
            
            {showForm && <PersonalForm />}
        </div>
    );
}

export default UpBar;
