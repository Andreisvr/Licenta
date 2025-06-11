import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import "../page_css/Login.css";
import GoogleBtn from '../components/login_btn'; // Google login button component
// import axios from 'axios';
import UpBar_Log from '../components/up_bar_Login'; // Top bar component for login page

import "../images/wallpaperflare.com_wallpaper.jpg";
import { AppContext } from '../components/AppContext'; // Context for global app state (login, admin)
import BACKEND_URL from '../server_link'; // Backend API base URL

function LogIn() {
  // Local state to hold input values and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate(); // For programmatic navigation
  const { handleLogin, handleAdmin } = useContext(AppContext); // Functions from context to update login/admin status

  // Handler for Gmail login success: called with the decoded Google token
  const handleGmailLogin = async (decodedToken) => {
    const gmailEmail = decodedToken.email;
    const gmailName = `${decodedToken.given_name} ${decodedToken.family_name}`;
    const gmail_password = decodedToken.jti; // Using token ID as a password placeholder

    try {
        // Send Gmail email and password to backend for authentication
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: gmailEmail, pass: gmail_password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // If login is successful, get user info from response
            const { name, email, prof, faculty, program } = data.user;
            
            // If user is admin, update context and navigate to admin page
            if (name === 'admin') {
                handleAdmin('admin');
                navigate('/Admin_Page');
            } else {
                // Determine user type and update context accordingly, then navigate to profile page
                const userType = prof === 1 ? 'professor' : 'student';
                handleLogin(name, email, userType, userType === 'student' ? program : null, faculty);
                navigate('/prof');
                handleAdmin('user'); // Reset admin status to user
            }
        } else {
            alert('A apărut o eroare'); // Show generic error alert
        }
    } catch (error) {
        console.error("Error logging in:", error);
        setEmailError('An error occurred. Please try again later.');
    }
  };

  // Handler for regular login button click
  const onButtonClick = async () => {
    // Reset error messages before validating inputs
    setEmailError('');
    setPasswordError('');

    // Basic validation: email must not be empty
    if (email === '') {
        setEmailError('Please enter your email');
        return;
    }

    // Basic validation: password must not be empty
    if (password === '') {
        setPasswordError('Please enter a password');
        return;
    }

    try {
      // Send login request to backend with email and password
      const response = await fetch(`${BACKEND_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
          // If login successful, extract user info
          const { name, email, prof, faculty, program } = data.user;
          const userType = prof === 1 ? 'professor' : 'student';

          // If user is admin, set admin context and navigate to admin page
          if (name.toLowerCase() === 'admin') {
              handleAdmin('admin');
              navigate('/Admin_Page');
          } else {
              // Otherwise, update login context and navigate to profile page
              handleLogin(name, email, userType, userType === 'student' ? program : null, faculty);
              handleAdmin('user'); // Reset admin status to user
              navigate('/prof');
          }
      } else {
          // Display backend error message or generic message if login fails
          setEmailError(data.message || 'Invalid credentials');
      }
  } catch (error) {
      console.error("Error logging in:", error);
      setEmailError('An error occurred. Please try again later.');
  }
  };

  return (
    <div className='body_login'>
      <UpBar_Log /> {/* Top navigation bar */}
      <form className='form_login'>
        <h1 className='title'>Login</h1>
        {/* Email input field */}
        <div className={'field_container'}>
          <input
            value={email}
            placeholder="Enter your email here"
            onChange={(ev) => setEmail(ev.target.value)}
            className={'inputBox'}
          />
          <label className="errorLabel">{emailError}</label> {/* Email validation errors */}
        </div>
        {/* Password input field */}
        <div className={'field_container'}>
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className={'inputBox'}
          />
          <label className="errorLabel">{passwordError}</label> {/* Password validation errors */}
        </div>
        {/* Links for password recovery and registration */}
        <div className="links_container">
          <Link className="link_forget" to="/restore_pass">Forget the password</Link>
          <Link className="link_register" to="/type">Register</Link>
        </div>
        {/* Login and Google login buttons */}
        <div className={'inputContainer'}>
          <input className={'Login_btn'} type="button" onClick={onButtonClick} value={'Log in'} />
          <GoogleBtn className='google_btn' onSuccessLogin={handleGmailLogin} />
        </div>
      </form>
    </div>
  );
}

export default LogIn;
