import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Regist_Form_Prof.css';
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

  const navigate = useNavigate();

  const onButtonClick = () => {
    setEmailError('');
    setFullNameError('');
    setFacultyError('');
    setProgramError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validation checks
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

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
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

    
    console.log({
      fullName,
      email,
      faculty,
      program,
      password, 
    });

   
    setShowTermsForm(true);
  };

  const handleSelection = (selectedFaculty, selectedProgram) => {
    setFaculty(selectedFaculty); 
    setProgram(selectedProgram);
  };

 

  return (
    <div className='body_reg_prof'>
      {!showTermsForm ? (
        <form className='form_reg_prof'>
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
          <div className={'field_container_reg_prof'}>
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
          <div className={'field_container_reg_prof'}>
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
          <div className={'field_container_reg_prof'}>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{confirmPasswordError}</label>
          </div>
          <div className={'inputContainer_reg_prof'}>
            <input className={'Reg_btn_reg_prof'} type="button" onClick={onButtonClick} value={'Register'} />
          </div>
        </form>
      ) : (
        <form className='form_reg_prof'>
          <h1 className='title'>Accept Terms and Conditions</h1>
          <p>You accept your terms and conditions</p>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(ev) => setVerificationCode(ev.target.value)}
            className={'inputBox'}
          />
         
        </form>
      )}
    </div>
  );
}

export default RegFormStudent;
