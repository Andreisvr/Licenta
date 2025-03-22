import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleBtn from '../../components/login_btn';
import "../../page_css/reg_stud.css";
import BACKEND_URL from '../../server_link';
import SEND_URL from '../../email_link';

import FacultyList from '../../components/Faculty_List';

function RegFormStudent() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [facultyError, setFacultyError] = useState('');
  const [programError, setProgramError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showTermsForm, setShowTermsForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [UserData, setUserData] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();


  
  useEffect( () => {
    if (showTermsForm) {
      if (UserData.email) {
      
       StartSending();
      }
    }
  }, [showTermsForm, UserData.email]);

  const showErrorPopup = (message) => {
    alert(message);
  };

  function StartSending () {
    if(!emailSent){
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
   
    SendEmail(UserData.email,code);
    setEmailSent(true);
  }

    
  };

  const  SendEmail = async (email,code) =>{

    const terms = `Termeni și Condiții pentru Platforma de Selectare a Temelor de Licență
    Ultima actualizare: 08/03/2025
    
    Acest document stabilește termenii și condițiile de utilizare a platformei de selectare a temelor de licență (Platforma), destinată exclusiv studenților și profesorilor din cadrul universității. Prin utilizarea Platformei, sunteți de acord cu acești termeni și condiții.
    
    1. Condiții de Utilizare
    1.1. Platforma este destinată exclusiv studenților și profesorilor universității pentru procesul de selecție și gestionare a temelor de licență.
    1.2. Accesul la Platformă se face prin autentificare cu adresa de email instituțională sau prin autentificare cu Google.
    1.3. Sunteți responsabil pentru păstrarea confidențialității contului și a datelor de acces. Orice activitate efectuată prin contul dvs. este responsabilitatea dvs.
    
    2. Colectarea și Utilizarea Datelor
    2.1. Platforma colectează și utilizează următoarele date:
    
    - Studenți: nume, prenume, adresă de email, program de studiu, temele selectate.
    - Profesori: nume, prenume, adresă de email, temele propuse și acceptate.
    
    2.2. Datele sunt utilizate exclusiv pentru gestionarea procesului de selecție a temelor și nu vor fi partajate cu terți în afara universității.
    
    3. Drepturi și Responsabilități
    3.1. Utilizatorii se obligă să utilizeze Platforma în scopul pentru care a fost creată, fără a încerca să compromită securitatea sau integritatea sistemului.
    3.2. Orice utilizare abuzivă a Platformei (ex. acces neautorizat, utilizarea unor date false, încercarea de a manipula procesul de selecție) poate duce la restricționarea accesului și măsuri disciplinare conform regulamentelor universității.
    
    4. Confidențialitate și Protecția Datelor
    4.1. Platforma respectă reglementările privind protecția datelor cu caracter personal și nu va distribui informațiile utilizatorilor în scopuri comerciale.
    4.2. Aveți dreptul de a solicita accesul la datele dvs., corectarea acestora sau ștergerea contului printr-o cerere oficială adresată administratorilor Platformei.
    
    5. Modificări ale Termenilor și Condițiilor
    5.1. Universitatea își rezervă dreptul de a modifica acești termeni și condiții. Orice modificare va fi notificată utilizatorilor prin email.
    5.2. Continuarea utilizării Platformei după actualizarea termenilor reprezintă acceptarea noilor condiții.
    
    Dacă aveți întrebări, ne puteți contacta la [email de suport].
    
    Prin utilizarea Platformei, confirmați că ați citit și acceptat acești Termeni și Condiții.
   
    EN: 
    Terms and Conditions for the Thesis Selection Platform
Last updated: 08/03/2025

This document establishes the terms and conditions for the use of the thesis selection platform (the "Platform"), intended exclusively for students and professors at the university. By using the Platform, you agree to these terms and conditions.

1. Terms of Use
1.1. The Platform is exclusively intended for students and professors of the university for the process of selecting and managing thesis topics.
1.2. Access to the Platform is done via authentication with your institutional email address or through Google authentication.
1.3. You are responsible for maintaining the confidentiality of your account and access data. Any activity carried out through your account is your responsibility.

2. Data Collection and Use
2.1. The Platform collects and uses the following data:

- Students: name, surname, email address, study program, selected thesis topics.
- Professors: name, surname, email address, proposed and accepted thesis topics.

2.2. The data is used exclusively for managing the thesis selection process and will not be shared with third parties outside the university.

3. Rights and Responsibilities
3.1. Users agree to use the Platform for its intended purpose, without attempting to compromise the security or integrity of the system.
3.2. Any abusive use of the Platform (e.g., unauthorized access, using false data, attempting to manipulate the selection process) may lead to restricted access and disciplinary measures according to the university’s regulations.

4. Privacy and Data Protection
4.1. The Platform complies with data protection regulations and will not distribute user information for commercial purposes.
4.2. You have the right to request access to your data, correct it, or delete your account by submitting an official request to the Platform administrators.

5. Changes to the Terms and Conditions
5.1. The university reserves the right to modify these terms and conditions. Any changes will be communicated to users by email.
5.2. Continued use of the Platform after the terms are updated constitutes acceptance of the new terms.

If you have any questions, you can contact us at [support email].

By using the Platform, you confirm that you have read and accepted these Terms and Conditions.`;
    
    const userDataToSend = {
      email: email,
      code: code,
      terms:terms
    };
    

    try {
      const response = await fetch(`${SEND_URL}/reg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToSend),
      });
     // console.log("Response status:", response.status);
      const data = await response.json();
      if (response.ok) {
      //  console.log(data.message); 
        
      } else {
        console.error('Error:', data.message); 
        alert('Error sending verification email: ' + data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error sending verification email: ' + error.message);
    }

  };

  const onSuccessLogin = (decodedToken) => {
    setFacultyError('');
    setProgramError('');

    const firstName = decodedToken.given_name;
    const lastName = decodedToken.family_name;
    const email = decodedToken.email;
    const gmailPass = decodedToken.jti;

    if (!faculty) {
      showErrorPopup('Please select a faculty');
      setFacultyError('Please select a faculty Program is not mandatory');
      return;
    }

    

    setUserData({
      name: `${firstName} ${lastName}`,
      email: email,
      gmailPass: gmailPass,
      faculty: faculty,
      program: program
    });

    setShowTermsForm(true);
    
  };


  async function verificaEmail(email) {
    try {
        const response = await fetch(`${BACKEND_URL}/verifica-email?email=${email}`, {
            method: 'GET',
        });
        const data = await response.json();
       
       
        return data.exists;
    } catch (error) {
        console.error('Eroare la cererea API:', error);
        return false; 
    }
  }


  const onButtonClick = async () => {
    setEmailError('');
    setFullNameError('');
    setFacultyError('');
    setProgramError('');
    setPasswordError('');
    setConfirmPasswordError('');
  
    if (!fullName) {
      setFullNameError('Please enter your full name');
      return; 
    }
  
    if (!faculty) {
      setFacultyError('Please select a faculty');
      return; 
    }
  
    if (!email) {
      setEmailError('Please enter your email');
      return; 
    }
  
    if (!/^[\w-\.]+@e-uvt\.ro$/.test(email)) {
      setEmailError('Please enter a valid email with @e-uvt.ro');
      return;
    }
  
    if (!password) {
      setPasswordError('Please enter a password');
      return; 
    }
  
    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }
  
    if (!/[A-Z]/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('The password must contain at least one uppercase letter or one special character');
      return; 
    }
  
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
  
    setUserData({
      program: program,
      faculty: faculty,
      name: fullName,
      email: email,
      password: password,
    });
    setShowTermsForm(true);
  };
  

  const handleVerification = async (event) => {
    event.preventDefault();


    fetch(`${BACKEND_URL}/Verify_Profesor?email=${UserData.email}`)
        .then((response) => response.json())
        .then(async (data) => {
          

            let userDataToSend = {
                name: UserData.name,
                email: UserData.email,
                password: UserData.password || null, 
                gmail_password: UserData.gmailPass || null, 
                faculty: UserData.faculty,
                cv_link: null,
                entered: 0, 
            };

            
            if (data.found) {
                userDataToSend.entered = 1;
            }

            
            if (verificationCode === generatedCode) {
              const emailExists = await verificaEmail(userDataToSend.email);

        
              if (emailExists) {
                  alert('Email-ul este deja înregistrat. Vă rugăm să folosiți altul.');
                  return; 
              }

                try {
                 
                    const response = await fetch(`${BACKEND_URL}/reg`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userDataToSend),
                    });

                    if (response.ok) {
                        const data = await response.json();
                       
                        navigate('/login');
                        
                    } else if (response.status === 409) {
                        const errorData = await response.json();
                        alert(`User Already Exist: ${errorData.message}`);
                    } else {
                        const errorData = await response.json();
                        alert(`Eroare la înregistrare: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Eroare la trimiterea datelor:', error);
                    alert('A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.');
                }
            } else {
                alert('Codul de verificare este incorect. Vă rugăm să încercați din nou.');
            }
        })
        .catch((error) => {
            console.error("Error fetching verification data:", error);
        });
};




  const handleSelection = (faculty, program) => {
    setFaculty(faculty);
    setProgram(program);
  };

  const handleGoBack = () => {
    setShowTermsForm(false);
    setEmail('');
    setFullName('');
    setFaculty('');
    setProgram('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setFullNameError('');
    setFacultyError('');
    setProgramError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  return (
    <div className='body_reg_stud'>
      {!showTermsForm ? (
        <form className='form_reg_stud'>
          <h1 className='title'>Information</h1>
          <br />
          <div className={'field_container'}>
            <FacultyList onSelect={handleSelection} />
            <label className="errorLabel">{facultyError}</label>
          </div>
          <br />
          <div className={'field_container'}>
            <input
              value={fullName}
              placeholder="Enter your full name"
              onChange={(ev) => setFullName(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{fullNameError}</label>
          </div>
          <br />
          <div className={'field_container_reg_stud'}>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(ev) => setEmail(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{emailError}</label>
          </div>
          <br />
          <div className={'field_container_reg_stud'}>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(ev) => setPassword(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{passwordError}</label>
          </div>
          <br />
          <div className={'field_container_reg_stud'}>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{confirmPasswordError}</label>
          </div>
          <GoogleBtn onSuccessLogin={onSuccessLogin} isRegister={true} />

          <div className={'inputContainer_reg_stud'}>
            <input className={'Reg_btn_reg_stud'} type="button" onClick={onButtonClick} value={'Register'} />
          </div>
        </form>
      ) : (
        <form className='form_reg_stud' onSubmit={handleVerification}>
          <h1 className='title'>Accept Terms and Conditions</h1>
          <p>If you select "Register," you accept the terms and conditions.</p>
          <p>A code has been sent to your email: <strong>{UserData.email}</strong>. Please enter this code.</p>

          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(ev) => setVerificationCode(ev.target.value)}
            className={'inputBox'}
            required
          />
          <div className={'inputContainer_reg_stud'}>
            <input className={'Reg_btn_reg_stud'} type="submit" value="Verify" />
            <input className={'Reg_btn_reg_stud'} type="button" value="Go Back" onClick={handleGoBack} />
          </div>
        </form>
      )}
    </div>
  );
}

export default RegFormStudent;
