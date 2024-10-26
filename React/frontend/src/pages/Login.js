import React, { useState,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Login.css';
import GoogleBtn from '../components/login_btn';
import axios from 'axios';
import { AppContext } from '../components/AppContext';



function LogIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const { handleLogin } = useContext(AppContext); 

  const handleGmailLogin = async (decodedToken) => {
    const gmailEmail = decodedToken.email;
    const gmailName = `${decodedToken.given_name} ${decodedToken.family_name}`;

    
    try {
      const response = await axios.post('http://localhost:8081/login', {
        email: gmailEmail,
        password: ''
      });

      if (response.data.success) {
      
        const { name, email, prof } = response.data.user;
        const userType = prof === 1 ? 'professor' : 'student'; 
        handleLogin(name, email, userType); 
        console.log(prof)
        navigate('/prof');
      } else {
        
        const newUser = {
          email: gmailEmail,
          gmail: true,
          name: gmailName,
          password: '', // No password for Google login
          verified: false,
          verify_nr: null,
        };

        // Optionally, send the new user data to your registration endpoint
        await axios.post('http://localhost:8081/reg', newUser);
        navigate('/prof'); // Navigate after creating the new user
      }
    } catch (error) {
      console.log("Error logging in:", error);
      setEmailError('An error occurred. Please try again later.');
    }
  };

  const onButtonClick = async () => {
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (email === '') {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    // Validate password
    if (password === '') {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    // Send login request to the server
    try {
      const response = await axios.post('http://localhost:8081/login', {
        email,
        password,
      });
      
      if (response.data.success) {
        
        navigate('/prof');
      } else {
        
        if (response.data.message) {
          setEmailError(response.data.message);
        } else {
          setEmailError('Invalid credentials');
        }
      }
    } catch (error) {
      console.log("Error logging in:", error);
      setEmailError('An error occurred. Please try again later.');
    }
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
          <Link className="link_register" to="/type">Register</Link>
        </div>
        <br />
        <div className='google_btn'>
          <GoogleBtn onSuccessLogin={handleGmailLogin} />
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
