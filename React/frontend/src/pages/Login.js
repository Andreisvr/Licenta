import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Login.css';
import GoogleBtn from '../components/login_btn';

function LogIn  () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = () => {
    // Resetting error messages
    setEmailError('');
    setPasswordError('');

    // Email validation
    if ('' === email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    // Password validation
    if ('' === password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    // Logic for authentication here...
  };

  return (
    <div className='body_login'>
      <form className='form_login'>
        <h1 className='title'>Login</h1>
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

        <div className="links_container">
          <Link className="link_forget" to="/">Forget the password</Link>
          <Link className="link_register" to="/reg">Register</Link>
        </div>
        <br/>
        <div className='google_btn'>
          <GoogleBtn/>
        </div>
        <br />
        <div className={'inputContainer'}>
          <input className={'Login_btn'} type="button" onClick={onButtonClick} value={'Log in'} />
        </div>
       
      </form>
    </div>
  );
}

export default LogIn;
