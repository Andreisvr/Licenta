import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icon for the menu

const facultyPrograms = ["Proposed", "Available", "Blocked"]; // Only 3 options

export default function Available() {
  const [anchorElFaculty, setAnchorElFaculty] = React.useState(null);
  const [selectedFaculty, setSelectedFaculty] = React.useState('');

  const openFacultyMenu = Boolean(anchorElFaculty);

  const handleClickFaculty = (event) => {
    setAnchorElFaculty(event.currentTarget);
  };

  const handleSelectFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setAnchorElFaculty(null);
  };

  const handleCloseFaculty = () => {
    setAnchorElFaculty(null);
  };

  return (
    <div>
    
      <Button
        id="fade-button-faculty"
        aria-controls={openFacultyMenu ? 'fade-menu-availability' : undefined}
        aria-haspopup="true"
        aria-expanded={openFacultyMenu ? 'true' : undefined}
        onClick={handleClickFaculty}
        style={{ background:'white',color: 'black', border: '1px solid black', display: 'flex', alignItems: 'center' }} 
      >
        <IconButton style={{ padding: 0, marginRight: '8px' }}>
          <MenuIcon style={{ color :'black' }}/> 
        </IconButton>
        {selectedFaculty ? selectedFaculty : 'Choose availability of option'}
      </Button>
      <Menu
        id="fade-menu-faculty"
        MenuListProps={{
          'aria-labelledby': 'fade-button-faculty',
        }}
        anchorEl={anchorElFaculty}
        open={openFacultyMenu}
        onClose={handleCloseFaculty}
        TransitionComponent={Fade}
        
      >
        {facultyPrograms.map((faculty) => (
          <MenuItem key={faculty} onClick={() => handleSelectFaculty(faculty)} style={{ color: 'black' }}>
            {faculty}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
