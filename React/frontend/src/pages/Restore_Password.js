import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Login.css';

function RestorePass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [foundTable, setFoundTable] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setEmailError('');
    if (email.trim() === '') {
        setEmailError('Please enter your email');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/check-email/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log('Server response:', data);

            setFoundTable(data.table);
            console.log('Table found:', data.table);

            const code = Math.floor(100000 + Math.random() * 900000);
            setGeneratedCode(code);
            console.log('Codul de verificare:', code);
        // Trimitere cod către server pentru email
            // const sendCodeResponse = await fetch('http://localhost:5002/reg', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ email, code }),
            // });
    
            // if (!sendCodeResponse.ok) {
            //     throw new Error(`Error sending verification code: ${sendCodeResponse.status}`);
            // }


            setStep(2);
        } else if (response.status === 403) {
            // Utilizator logat cu Gmail
            setEmailError(data.message || 'Cannot change password for Gmail accounts.');
        } else if (response.status === 404) {
            // Email negăsit
            setEmailError(data.message || 'Email not found');
        } else {
            setEmailError('An unexpected error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error during email submission:', error);
        setEmailError('An error occurred. Please try again.');
    }
};




  const handleCodeSubmit = () => {
    if (verificationCode === String(generatedCode)) {
      setStep(3); 
    } else {
      setEmailError('Incorrect verification code');
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordError('');
    if (newPassword.trim() === '' || repeatPassword.trim() === '') {
        setPasswordError('Please fill in all fields');
        return;
    }
    if (newPassword !== repeatPassword) {
        setPasswordError('Passwords do not match');
        return;
    }

    console.log('Submitting password update for:', email, 'in table:', foundTable);

    try {
        const response = await fetch('http://localhost:8081/update-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: newPassword, table: foundTable }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (data.success) {
            navigate('/login');
        } else {
            setPasswordError(data.message || 'Failed to update password');
        }
    } catch (error) {
        console.error('Error during password update:', error);
        setPasswordError('An error occurred. Please try again.');
    }
};



  return (
    <div className="body_login">
      <form className="form_login">
        <h1 className="title">Restore Password</h1>
        {step === 1 && (
          <div className="field_container">
            <input
              value={email}
              placeholder="Enter your email here"
              onChange={(ev) => setEmail(ev.target.value)}
              className="inputBox"
            />
            <label className="errorLabel">{emailError}</label>
            <button type="button" onClick={handleEmailSubmit} className="Login_btn">
              Submit
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="field_container">
            <input
              value={verificationCode}
              placeholder="Enter the verification code"
              onChange={(ev) => setVerificationCode(ev.target.value)}
              className="inputBox"
            />
            <label className="errorLabel">{emailError}</label>
            <button type="button" onClick={handleCodeSubmit} className="Login_btn">
              Verify
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="field_container">
              <input
                value={newPassword}
                type="password"
                placeholder="Enter new password"
                onChange={(ev) => setNewPassword(ev.target.value)}
                className="inputBox"
              />
            </div>
            <div className="field_container">
              <input
                value={repeatPassword}
                type="password"
                placeholder="Repeat new password"
                onChange={(ev) => setRepeatPassword(ev.target.value)}
                className="inputBox"
              />
            </div>
            <label className="errorLabel">{passwordError}</label>
            <button type="button" onClick={handlePasswordSubmit} className="Login_btn">
              Reset Password
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default RestorePass;
