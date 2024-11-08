import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; 

const facultyPrograms = {
  "Facultatea de Științe Politice, Filosofie și Științe ale Comunicării": {
    licenta: ["Administrație publică","Comunicare și relații publice","Filosofie","Jurnalism","Media digitală","Publicitate","Relații internaționale și studii europene", "Științe politice","Studii de securitate",],
    masterat:["Comunicare publicitară în medii digitale", "Comunicare și mediere în conflicte sociale", "International development and management of global affairs", "Mass media și relații publice. Tehnici de redactare și comunicare", "Philosophical counselling and consultancy", "Politici publice și advocacy", "Studii de securitate globală"]
    
  },
  "Facultatea de Economie și de Administrare a Afacerilor": {
    licenta: ["Economia, comerţului, turismului şi serviciilor (IF)", "Contabilitate şi informatică de gestiune (IF - în limba română)", "Contabilitate şi informatică de gestiune (IF - în limba germană)", "Contabilitate şi informatică de gestiune (ID)", "Economie generală şi comunicare economică (IF)", "Economie și afaceri internaționale (IF)", "Finanţe și bănci (IF – în limba română)", "Finanţe și bănci (IF – în limba engleză)", "Finanţe și bănci (ID)", "Management (IF – în limba română)", "Management (IF – în limba franceză)", "Management (ID)", "Marketing (IF)", "Informatică economică (IF)"],
    masterat: ["Administrarea afacerilor în turism și industria ospitalității", "Auditul și managementul financiar al fondurilor europene", "Audit financiar-contabil", "Expertiză contabilă și evaluarea afacerilor", "Contabilitate, control și guvernanță", "Contabilitate și audit în instituțiile publice", "Studii europene și economia integrării", "Management și integrare europeană", "Guvernanță organizațională și consultanță fiscală", "Piețe financiare, bănci și asigurări", "Master in Sustainable Finance", "Sisteme informaționale pentru afaceri", "Administrarea organizațiilor de afaceri", "Diagnostic, evaluare și consultanță în afaceri", "Global entrepreneurship, economics and management", "Le management des affaires en contexte europeen", "Le management des affaires en contexte europeen (IFR)", "Managementul resurselor umane", "Managementul strategic al organizațiilor. Dezvoltarea spațiului de afaceri", "Management of business organizations", "Marketing și mangementul vânzărilor", "Publicitate și promovarea vânzărilor", "Marketing strategic și marketing digital"]

  },
  "Facultatea de Educație Fizică și Sport": {
    licenta: ["Educație fizică și sportivă", "Educație fizică și sportivă (învățământ cu frecvență redusă)", "Kinetoterapie și motricitate specială", "Sport și performanță motrică"],
    masterat: ["Educație fizică și sportivă", "Fitness și performanță motrică", "Managementul activităților și organizațiilor de educație fizică și sportive", "Kinetoterapie în patologia ortopedico-traumatică", "Kinetoprofilaxie și recuperare fizică", "Masterat didactic în Educație fizică și sport"]

  },
  "Facultatea de Drept": {
    licenta: ["Drept (învățământ cu frecvență)", "Drept (învățământ cu frecvență redusă)", "Drept european și internațional (bilingv română-engleză) (învățământ cu frecvență)"],
    masterat: ["Dreptul afacerilor (învățământ cu frecvență)", "Drept fiscal (învățământ cu frecvență redusă)", "Științe penale (învățământ cu frecvență)", "Dreptul Uniunii Europene/European Union Law (învățământ cu frecvență)", "Carieră judiciară (învățământ cu frecvență)", "Contenciosul administrativ și fiscal (învățământ cu frecvență)"]  },
 
    "Facultatea de Muzică și Teatru": {
      licenta: ["Interpretare muzicală - instrumente", "Interpretare muzicală - canto", "Muzică", "Artele spectacolului (actorie)", "Artele spectacolului (actorie) (în limba germană)"]
      ,
      masterat:["Stilistica interpretării muzicale", "Artele spectacolului de teatru"]
    },
    " Facultatea de Chimie, Biologie, Geografie": {
      licenta:["Biologie", "Biochimie", "Chimie", "Chimie medicală", "Geografie", "Geografia turismului", "Geoinformatică", "Planificare teritorială", "Științe aplicate în criminalistică"]
      ,
      masterat:["Biologia dezvoltării și influența factorilor exogeni asupra organismelor", "Masterat didactic în Biologie", "Chimie clinică şi de laborator sanitar", "Chimie criminalistică", "Masterat didactic în Chimie", "Planificarea şi dezvoltarea durabilă a teritoriului", "Dezvoltare şi amenajare turistică", "Geographic Information Systems", "Masterat didactic în Geografie"]

  
    },
    "Facultatea de Matematică și Informatică": {
      licenta:["Matematică", "Matematică informatică", "Informatică", "Informatică (în limba engleză)", "Inteligență artificială (în limba engleză)", "Informatica (forma de învățământ la distanță)"]
      ,
      masterat:["Modelări analitice şi geometrice ale sistemelor", "Matematici financiare", "Artificial Intelligence and Distributed Computing (în limba engleză)", "Intelligent Software Robotics (în limba engleză)", "Inginerie software", "Big Data – Data Science, Analytics and Technologies (în limba engleză)", "Bioinformatică", "Cybersecurity (în limba engleză)"]
    },
    "Facultatea de Arte și Design": {
      licenta: ["Arte plastice (fotografie - videoprocesare computerizată a imaginii)", "Arte plastice (Pictură)", "Arte plastice (Grafică)", "Arte plastice (Sculptură)", "Arte decorative (rute: Ceramică, Arte textile)", "Conservare și restaurare", "Design (rute: Design grafic, Design de produs, Design de interior)", "Modă - design vestimentar"]
      ,
      masterat:["Design interior și de produs", "Design grafic – Comunicare vizuală", "Design vestimentar – Design textil", "Foto video", "Grafică publicitară și de carte", "Patrimoniu, restaurare și curatoriat în artele vizuale", "Sculptură și ceramică", "Pictură - Surse și resurse ale imaginii", "Artă eclezială și restaurare", "Game Art (în limba engleză)"]
  
    },
    "Facultatea de Sociologie și Psihologie": {
      licenta: ["Asistență socială cu frecvență română", "Asistență socială la distanță română", "Psihologie ", "Psihologie – Științe cognitive (în limba engleză) cu frecvență engleză", "Sociologie cu frecvență română", "Resurse umane cu frecvență română", "Pedagogie română", "Pedagogia învățământului primar și preșcolar", "Psihopedagogie specială"]
      ,
      masterat:["Management și supervizare în bunăstarea copilului și a familiei", "Asistență socială", "Psihologia muncii, psihologie organizațională și a transporturilor", "Psihologie clinică și psihoterapie", "Antreprenoriat social și dezvoltare comunitară", "Sociologie", "Managementul resurselor umane în administrarea organizațiilor", "Management educațional și dezvoltare curriculară", "Consiliere și integrare educațională", "Terapii specifice ale limbajului și comunicării"]
  
    },
    "Facultatea de Fizică": {
      licenta: ["Fizică", "Fizică medicală", "Fizică informatică"],
      masterat:["Fizică aplicată în medicină", "Advanced research methods in physics", "Masterat didactic în Fizică"]
    },
    "Facultatea de Litere, Istorie și Teologie": {
      licenta:["TEOLOGIE ORTODOXĂ PASTORALĂ", "LIMBĂ ȘI LITERATURĂ"],
      masterat:["Literatură şi cultură - contexte româneşti, contexte europene", "Tendinţe actuale în studiul limbii române", "Teoria şi practica traducerii (engleză și franceză)", "Studii americane", "Studii romanice culturale şi lingvistice (latină, franceză, italiană, spaniolă)", "Germana în context european - studii interdisciplinare şi multiculturale", "Digital Technologies for Language Research and Applications", "Istorie conceptuală românească în context european", "Teologie Ortodoxă și Misiune Creștină"]
    }
};
export default function FacultyList({ onSelect }) {
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
    setPrograms(facultyPrograms[faculty]);
    setSelectedProgram('');
    setAnchorElFaculty(null);
    onSelect(faculty, '');
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
    setAnchorElPrograms(null);
    onSelect(selectedFaculty, program); 
  };

  const handleClosePrograms = () => {
    setAnchorElPrograms(null);
    if (!selectedProgram) {
      onSelect(selectedFaculty, ''); 
    }
  };

  return (
    <div>
      <Button
        id="fade-button-faculty"
        aria-controls={openFacultyMenu ? 'fade-menu-faculty' : undefined}
        aria-haspopup="true"
        aria-expanded={openFacultyMenu ? 'true' : undefined}
        onClick={handleClickFaculty}
        style={{ background:'white', color: 'black', border: '1px solid black', display: 'flex', alignItems: 'center' }}
      >
        <IconButton style={{ padding: 0, marginRight: '8px' }}>
          <MenuIcon />
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
            border: '1px solid black', 
          },
        }}
      >
        {Object.keys(facultyPrograms).map((faculty) => (
          <MenuItem key={faculty} onClick={() => handleSelectFaculty(faculty)} style={{ color: 'black' }}>
            {faculty}
          </MenuItem>
        ))}
      </Menu>

      {selectedFaculty && (
        <div style={{ marginTop: '20px' }}>
          <Button
            id="fade-button-programs"
            aria-controls={openProgramsMenu ? 'fade-menu-programs' : undefined}
            aria-haspopup="true"
            aria-expanded={openProgramsMenu ? 'true' : undefined}
            onClick={handleClickPrograms}
            style={{ background:'white', color: 'black', border: '1px solid black', display: 'flex', alignItems: 'center' }}
          >
            <IconButton style={{ padding: 0, marginRight: '8px' }}>
              <MenuIcon />
            </IconButton>
            {selectedProgram ? selectedProgram : 'Choose your program*'}
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
                border: '1px solid black',
              },
            }}
          >
            {['licenta', 'masterat'].map((level) => (
              programs[level].map((program) => (
                <MenuItem key={program} onClick={() => handleSelectProgram(program)} style={{ color: 'black' }}>
                  {program}
                </MenuItem>
              ))
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
}