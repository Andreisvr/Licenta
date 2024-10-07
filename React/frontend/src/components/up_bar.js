import React,{useState} from "react";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/UpBar.css";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Grid } from "@mui/material";
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
        <Grid id="upbar" container alignItems="center">
            <Grid item>
                <IconButton aria-label={notificationsLabel(100)}>
                <Badge 
                        badgeContent={10} 
                        color="secondary" 
                        overlap="circular" 
                        sx={{ 
                            '.MuiBadge-dot': {
                                backgroundColor: 'white'
                            },
                            '.MuiBadge-badge': {
                                right: 60, 
                                top: 10,
                                backgroundColor: 'white', 
                                color: 'black'
                            } 
                        }}
                    >
                        <FavoriteBorderIcon className='icon' />
                    </Badge>
                </IconButton>   
            </Grid>
            
            <Grid item>
                <IconButton color='white' onClick={handleClickForm}>
                    <AccountBoxIcon className='icon' />
                </IconButton>
            </Grid>
            {showForm && <PersonalForm />}
        </Grid>
    );
}

export default UpBar;
