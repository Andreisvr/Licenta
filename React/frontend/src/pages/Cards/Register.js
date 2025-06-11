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


  // Effect triggered when showTermsForm becomes true and the user has entered their email
useEffect(() => {
  if (showTermsForm) {
    if (UserData.email) {
      StartSending(); // Begin the process of generating and sending the verification code
    }
  }
}, [showTermsForm, UserData.email]);

// Function to show error messages using a popup
const showErrorPopup = (message) => {
  alert(message);
};

// Starts the process of sending a verification email
function StartSending() {
  // If an email hasn't already been sent
  if (!emailSent) {
    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Send the code to the user's email
    SendEmail(UserData.email, code);
    setEmailSent(true); // Mark the email as sent
  }
}

// Sends a verification email to the user along with terms and conditions
const SendEmail = async (email, code) => {
  // Terms and conditions (in both Romanian and English)
  const terms = `Termeni și Condiții pentru Platforma de Selectare a Temelor de Licență
  ... (omitted for brevity, full text kept in actual code) ...
  By using the Platform, you confirm that you have read and accepted these Terms and Conditions.`;

  // Package user data for the email request
  const userDataToSend = {
    email: email,
    code: code,
    terms: terms,
  };

  try {
    // Send POST request to backend to trigger email sending
    const response = await fetch(`${SEND_URL}/reg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataToSend),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle errors from server
      console.error('Error:', data.message);
      alert('Error sending verification email: ' + data.message);
    }
  } catch (error) {
    // Catch and display network or fetch-related errors
    console.error('Fetch error:', error);
    alert('Error sending verification email: ' + error.message);
  }
};

// Callback for when Google login is successful
const onSuccessLogin = (decodedToken) => {
  setFacultyError('');
  setProgramError('');

  const firstName = decodedToken.given_name;
  const lastName = decodedToken.family_name;
  const email = decodedToken.email;
  const gmailPass = decodedToken.jti;

  // Faculty is mandatory for login
  if (!faculty) {
    showErrorPopup('Please select a faculty');
    setFacultyError('Please select a faculty Program is not mandatory');
    return;
  }

  // Set the decoded data as user information
  setUserData({
    name: `${firstName} ${lastName}`,
    email: email,
    gmailPass: gmailPass,
    faculty: faculty,
    program: program,
  });

  // Trigger terms and conditions form display
  setShowTermsForm(true);
};

// Function to check if an email already exists in the database
async function verificaEmail(email) {
  try {
    const response = await fetch(`${BACKEND_URL}/verifica-email?email=${email}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.exists; // Returns true if email exists
  } catch (error) {
    console.error('Eroare la cererea API:', error);
    return false; // Return false on error
  }
}

// Handles manual registration form submission
const onButtonClick = async () => {
  // Reset error states
  setEmailError('');
  setFullNameError('');
  setFacultyError('');
  setProgramError('');
  setPasswordError('');
  setConfirmPasswordError('');

  // Validate form fields
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

  // Check institutional email format
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

  // Check for uppercase letter or special character
  if (!/[A-Z]/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    setPasswordError('The password must contain at least one uppercase letter or one special character');
    return;
  }

  // Confirm password match
  if (password !== confirmPassword) {
    setConfirmPasswordError('Passwords do not match');
    return;
  }

  // Set user data and show terms form
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
