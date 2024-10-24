import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Regist_Form_Prof.css';
import GoogleBtn from '../components/login_btn';
import ProfList from '../components/Prof_List';
import FacultyList from '../components/Faculty_List';

function RegFormProf() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Adăugăm un câmp pentru confirmarea parolei
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showTermsForm, setShowTermsForm] = useState(false); // Înlocuiește formularul principal cu cel pentru termeni

  const navigate = useNavigate();

  const onButtonClick = () => {
    // Resetting error messages
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
   
    // Email validation
    if ('' === email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    
    if ('' === password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    // Verificăm dacă parola conține cel puțin o literă mare sau un semn special
    if (!/[A-Z]/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('The password must contain at least one uppercase letter or one special character');
      return;
    }

    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    // Afișăm formularul pentru acceptarea termenilor
    setShowTermsForm(true);

    setEmail('');
    setPassword('')
    setConfirmPassword('')
  };

  const handleTermsResponse = (accept) => {
    if (accept) {
     
      console.log('Terms accepted');
      navigate('/type')
    } else {
      // Logic for rejecting terms
      console.log('Terms rejected');
    }
    setShowTermsForm(false); // Ascunde formularul sau redirecționează dacă este necesar
  };

  return (
    <div className='body_reg_prof'>
        <form className='form_reg_prof'>
          <h1 className='title'>Information</h1>
          <br />
          <FacultyList/>
    
          <br />
          <div className={'field_container'}>
            <input
              value={email}
              placeholder="Enter your full name"
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
              placeholder="Enter your password here"
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

          <div className="links_container_reg_prof">
            <Link className="terms" to="/">Terms and conditions</Link>
            <Link className="link_register">Help</Link>
          </div>
      
          <div className={'inputContainer_reg_prof'}>
            <input className={'Reg_btn_reg_prof'} type="button" onClick={onButtonClick} value={'Register'} />
          </div>
        </form>
        
      
    </div>
  );
}

export default RegFormProf;
