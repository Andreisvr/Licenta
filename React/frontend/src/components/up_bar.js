import React,{useState} from "react";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/UpBar.css";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import PersonalForm from "./personal_cabinet";


function notificationsLabel(count) {
    if (count === 0) {
      return 'no notifications';
    }
    if (count > 99) {
      return 'more than 99 notifications';
    }
    return `${count} notifications`;
};


function UpBar() {
    const [showForm,setShowForm] = useState(false);
    
    const handleClickForm = () =>
    {
       setShowForm(!showForm);
    };

    return (
        <div className="upbar">
            
            <IconButton aria-label={notificationsLabel(100)} className="liked_icon">
                <Badge 
                    badgeContent={10} 
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
