import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import a menu icon or any other icon

const facultyPrograms = {
  "Facultatea de Științe Politice, Filosofie și Științe ale Comunicării": {
    licenta: ["Program Licență 1", "Program Licență 2"],
    masterat: ["Program Masterat 1", "Program Masterat 2"]
  },
  "Facultatea de Economie și de Administrare a Afacerilor": {
    licenta: ["Program Licență 3", "Program Licență 4"],
    masterat: ["Program Masterat 3", "Program Masterat 4"]
  },
  "Facultatea de Educație Fizică și Sport": {
    licenta: ["Program Licență 5", "Program Licență 6"],
    masterat: ["Program Masterat 5", "Program Masterat 6"]
  },
  // Add other faculties with their respective programs here
};

export default function FacultyList() {
  const [anchorElFaculty, setAnchorElFaculty] = React.useState(null);
  const [anchorElPrograms, setAnchorElPrograms] = React.useState(null);
  const [selectedFaculty, setSelectedFaculty] = React.useState('');
  const [programs, setPrograms] = React.useState({ licenta: [], masterat: [] });
  const [selectedProgram, setSelectedProgram] = React.useState('');

  const openFacultyMenu = Boolean(anchorElFaculty);
  const openProgramsMenu = Boolean(anchorElPrograms);

  const handleClickFaculty = (event) => {
    setAnchorElFaculty(event.currentTarget);
  };

  const handleSelectFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setPrograms(facultyPrograms[faculty]); // Update the programs based on the selected faculty
    setSelectedProgram(''); // Reset the selected program when a new faculty is chosen
    setAnchorElFaculty(null);
  };

  const handleCloseFaculty = () => {
    setAnchorElFaculty(null);
  };

  const handleClickPrograms = (event) => {
    if (selectedFaculty) {
      setAnchorElPrograms(event.currentTarget);
    }
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setAnchorElPrograms(null); // Close the programs menu after selection
  };

  const handleClosePrograms = () => {
    setAnchorElPrograms(null);
  };

  return (
    <div>
      {/* Faculty Selection Button with Menu Icon */}
      <Button
        id="fade-button-faculty"
        aria-controls={openFacultyMenu ? 'fade-menu-faculty' : undefined}
        aria-haspopup="true"
        aria-expanded={openFacultyMenu ? 'true' : undefined}
        onClick={handleClickFaculty}
        style={{ color: 'black', border: '1px solid black', display: 'flex', alignItems: 'center' }} // Add styles for text color, border, and flex alignment
      >
        <IconButton style={{ padding: 0, marginRight: '8px' }}>
          <MenuIcon /> {/* Icon indicating that it is a fade menu */}
        </IconButton>
        {selectedFaculty ? selectedFaculty : 'Choose your faculty'}
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
        PaperProps={{
          style: {
            border: '1px solid black', // Add a border to the menu
          },
        }}
      >
        {Object.keys(facultyPrograms).map((faculty) => (
          <MenuItem key={faculty} onClick={() => handleSelectFaculty(faculty)} style={{ color: 'black' }}> {/* Add text color to MenuItem */}
            {faculty}
          </MenuItem>
        ))}
      </Menu>

      {/* Study Programs Button */}
      {selectedFaculty && (
        <div style={{ marginTop: '20px' }}>
          <Button
            id="fade-button-programs"
            aria-controls={openProgramsMenu ? 'fade-menu-programs' : undefined}
            aria-haspopup="true"
            aria-expanded={openProgramsMenu ? 'true' : undefined}
            onClick={handleClickPrograms}
            style={{ color: 'black', border: '1px solid black', display: 'flex', alignItems: 'center' }} // Add styles for text color, border, and flex alignment
          >
            <IconButton style={{ padding: 0, marginRight: '8px' }}>
              <MenuIcon /> {/* Icon indicating that it is a fade menu */}
            </IconButton>
            {selectedProgram ? selectedProgram : 'Choose study program'}
          </Button>
          <Menu
            id="fade-menu-programs"
            MenuListProps={{
              'aria-labelledby': 'fade-button-programs',
            }}
            anchorEl={anchorElPrograms}
            open={openProgramsMenu}
            onClose={handleClosePrograms}
            TransitionComponent={Fade}
            PaperProps={{
              style: {
                border: '1px solid black', // Add a border to the menu
              },
            }}
          >
            <MenuItem disabled style={{ color: 'black' }}>Licență Programs</MenuItem>
            {programs.licenta.map((program, index) => (
              <MenuItem key={index} onClick={() => handleSelectProgram(program)} style={{ color: 'black' }}>
                {program}
              </MenuItem>
            ))}
            <MenuItem disabled style={{ color: 'black' }}>Masterat Programs</MenuItem>
            {programs.masterat.map((program, index) => (
              <MenuItem key={index} onClick={() => handleSelectProgram(program)} style={{ color: 'black' }}>
                {program}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
}
