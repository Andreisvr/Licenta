import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleBtn from '../../components/login_btn';
import "../../page_css/reg_stud.css";

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

  useEffect(() => {
    console.log("Updated UserData:", UserData);
  }, [UserData]);

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
    console.log(`Verification code for ${UserData.email}: ${code}`);
    SendEmail(UserData.email,code);
    setEmailSent(true);
  }
    
  };

  const  SendEmail = async (email,code) =>{

    const userDataToSend = {
      email: email,
      code: code 
    };
    

    try {
      const response = await fetch('http://localhost:5002/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToSend),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); 
        
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


    fetch(`http://localhost:8081/Verify_Profesor?email=${UserData.email}`)
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
                try {
                    const response = await fetch('http://localhost:8081/reg', {
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
                        alert(`Eroare la înregistrare: ${errorData.message}`);
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
          <GoogleBtn onSuccessLogin={onSuccessLogin} />
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
