import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleBtn from '../../components/login_btn';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/student_role/reg_stud.css';
import FacultyList from '/Users/Andrei_Sviridov/Desktop/React/frontend/src/components/Faculty_List.js';

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
  const [studyYear, setStudyYear] = useState('');

  const [studyYearError, setStudyYearError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Updated UserData:", UserData);
    console.log('nume ',UserData.fullName)
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
      const response = await fetch('http://localhost:5002/reg_stud', {
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


    const email = decodedToken.email;
    const gmailPass = decodedToken.jti;

    if (!faculty) {
      showErrorPopup('Please select a faculty');
      setFacultyError('Please select a faculty');
      return;
    }

    if (!program) {
      showErrorPopup('Please select a study program');
      setProgramError('Please select a study program');
      return;
    }

    if (!studyYear) {
      setStudyYearError('Please select a study year');
      return;
    }
  

    setUserData({
      fullName: decodedToken.name,
      email: email,
      gmailPass: gmailPass,
      faculty: faculty,
      program: program,
      year:studyYear
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
    setStudyYear('');

    if (!fullName) {
      setFullNameError('Please enter your full name');
      return;
    }

    if (!faculty) {
      setFacultyError('Please select a faculty');
      return;
    }

    if (!program) {
      setProgramError('Please select a study program');
      return;
    }

    if (!email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!studyYear) {
      setStudyYearError('Please select a study year');
      return;
    }

    // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //   setEmailError('Please enter a valid email');
    //   return;
    // }

    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }

    // if (password.length < 8) {
    //   setPasswordError('The password must be 8 characters or longer');
    //   return;
    // }

    // if (!/[A-Z]/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   setPasswordError('The password must contain at least one uppercase letter or one special character');
    //   return;
    // }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    setUserData({
      program: program,
      faculty: faculty,
      fullName: fullName,
      email: email,
      password: password,
      year:studyYear
    });
    setShowTermsForm(true);
  };

  const handleVerification = async (event) => {
    event.preventDefault();
    
    if (verificationCode === generatedCode) {
        
        const userDataToSend = {
            name: UserData.fullName,
            email: UserData.email,
            pass: password,
            gmail_pass: UserData.gmailPass,
            faculty: UserData.faculty,
            program: UserData.program,
            year:UserData.year
        };
        
        console.log('Date trimitse',userDataToSend);

        try {
            const response = await fetch('http://localhost:8081/reg_stud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataToSend),
            }); 

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                navigate('/login'); 
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
          <div className={'field_container'}>
              <select value={studyYear} onChange={(ev) => setStudyYear(ev.target.value)} className={'year_select'}>
                <option value="">Select study year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <label className="errorLabel">{studyYearError}</label>
            </div>
        
          <GoogleBtn onSuccessLogin={onSuccessLogin} />
          <div className={'inputContainer_reg_stud'}>
            <input className={'Reg_btn_reg_stud'} type="button" onClick={onButtonClick} value={'Register'} />
          </div>
        </form>
      ) : (
        <form className='form_reg_stud' onSubmit={handleVerification}>
          <h3 className='title'>Accept Terms and Conditions</h3>
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
