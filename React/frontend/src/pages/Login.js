import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import "../page_css/Login.css";
import GoogleBtn from '../components/login_btn';
import axios from 'axios';
import UpBar_Log from '../components/up_bar_Login';

import "../images/wallpaperflare.com_wallpaper.jpg";
import { AppContext } from '../components/AppContext';
import BACKEND_URL from '../server_link';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { handleLogin,handleAdmin } = useContext(AppContext); 

   
  const handleGmailLogin = async (decodedToken) => {
    const gmailEmail = decodedToken.email;
    const gmailName = `${decodedToken.given_name} ${decodedToken.family_name}`;
    const gmail_password = decodedToken.jti;

    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: gmailEmail,
                pass: gmail_password
            }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const { name, email, prof, faculty, program } = data.user;
            if (name === 'admin') {
                handleAdmin('admin');
                navigate('/Admin_Page');
            } else {
                const userType = prof === 1 ? 'professor' : 'student';
                handleLogin(name, email, userType, userType === 'student' ? program : null, faculty);
                navigate('/prof');
                handleAdmin('user');
            }
        } else {
            alert('A apărut o eroare');
        }
    } catch (error) {
        console.error("Error logging in:", error);
        setEmailError('An error occurred. Please try again later.');
    }
};

  const onButtonClick = async () => {
    setEmailError('');
    setPasswordError('');

    
    if (email === '') {
        setEmailError('Please enter your email');
        return;
    }
    
    // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //     setEmailError('Please enter a valid email');
    //     return;
    // }

   
    if (password === '') {
        setPasswordError('Please enter a password');
        return;
    }

    // if (password.length < 8) {
    //     setPasswordError('The password must be 8 characters or longer');
    //     return;
    // }

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email,
              password,
          }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
          const { name, email, prof, faculty, program } = data.user;
          const userType = prof === 1 ? 'professor' : 'student';
  
          if (name.toLowerCase() === 'admin') {
              handleAdmin('admin');
              navigate('/Admin_Page');
          } else {
              handleLogin(name, email, userType, userType === 'student' ? program : null, faculty);
              handleAdmin('user');
              navigate('/prof');
          }
      } else {
          setEmailError(data.message || 'Invalid credentials');
      }
  } catch (error) {
      console.error("Error logging in:", error);
      setEmailError('An error occurred. Please try again later.');
  }
  
};

  return (
    <div className='body_login'>
     <UpBar_Log/>
      <form className='form_login'>
        <h1 className='title'>Login</h1>
        <div className={'field_container'}>
          <input
            value={email}
            placeholder="Enter your email here"
            onChange={(ev) => setEmail(ev.target.value)}
            className={'inputBox'}
          />
          <label className="errorLabel">{emailError}</label>
        </div>
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
          <Link className="link_forget" to="/restore_pass">Forget the password</Link>
          <Link className="link_register" to="/type">Register</Link>
        </div>
       
        <div className={'inputContainer'}>
          <input className={'Login_btn'} type="button" onClick={onButtonClick} value={'Log in'} />
        
          <GoogleBtn className='google_btn' onSuccessLogin={handleGmailLogin} />
       
        </div>
      </form>
    </div>
  );
}

export default LogIn;
