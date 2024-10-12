import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Register.css';
import Google_btn from '../components/login_btn';

function Register() {
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
    <div className='body_login'>
      {!showTermsForm ? ( // Afișăm formularul de înregistrare dacă termenii nu sunt încă afișați
        <form className='form_login'>
          <h1 className='title'>Register</h1>
          <br />
          <div className={'field_container'}>
            <input
              value={email}
              placeholder="Enter your email here"
              onChange={(ev) => setEmail(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{emailError}</label>
          </div>
          <br />
          <div className={'field_container'}>
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
          <div className={'field_container'}>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              className={'inputBox'}
            />
            <label className="errorLabel">{confirmPasswordError}</label>
          </div>

          <div className="links_container">
            <Link className="terms" to="/">Terms and conditions</Link>
            <Link className="link_register">Help</Link>
          </div>
          <br />
          <div className='google_btn'>
            <Google_btn />
          </div>
          <br />
          <div className={'inputContainer'}>
            <input className={'Reg_btn'} type="button" onClick={onButtonClick} value={'Register'} />
          </div>
        </form>
      ) : ( // Afișăm formularul de termeni și condiții dacă butonul "Register" a fost apăsat
        <form className="terms_form">
          <h2>Please accept our terms and conditions</h2>
          <p>Do you accept the terms and conditions for data processing?</p>
          <button onClick={() => handleTermsResponse(true)} className='accept_btn'>Accept</button>
          <button onClick={() => handleTermsResponse(false)} className='reject_btn'>Reject</button>
          <div className="links_container">
            <Link className="terms" to="/">Read Terms and conditions</Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;
