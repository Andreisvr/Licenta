import React, { useState } from 'react';  // Import React and useState hook for state management
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation between routes
import UpBar_Log from '../components/up_bar_Login';  // Import top bar component for login pages
import BACKEND_URL from '../server_link';  // Import backend URL constant for API calls
import SEND_URL from '../email_link';      // Import email sending service URL
import "../page_css/Login.css";             // Import CSS styles for login-related pages


function RestorePass() {
  // State to track the current step of the password restoration process (1=email input, 2=verify code, 3=new password)
  const [step, setStep] = useState(1);

  // State variables for user input and error handling
  const [email, setEmail] = useState('');               // User's email input
  const [emailError, setEmailError] = useState('');     // Error message for email validation or API errors
  const [verificationCode, setVerificationCode] = useState(''); // User input for verification code
  const [generatedCode, setGeneratedCode] = useState(null);     // Generated verification code sent via email
  const [newPassword, setNewPassword] = useState('');   // New password input
  const [repeatPassword, setRepeatPassword] = useState(''); // Confirmation of new password
  const [passwordError, setPasswordError] = useState(''); // Error message for password validation or update errors
  const [foundTable, setFoundTable] = useState('');     // Table name returned from backend to identify user type (e.g., student, professor)

  const navigate = useNavigate();  // Hook for navigation

  // Handler for submitting the email to start password reset process
  const handleEmailSubmit = async () => {
    setEmailError('');  // Clear previous email errors

    // Basic validation: check email is not empty
    if (email.trim() === '') {
        setEmailError('Please enter your email');
        return;
    }

    try {
        // Send GET request to backend to check if email exists and can be reset
        const response = await fetch(`${BACKEND_URL}/check-email/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status === 200) {
            // Email exists and can be used for password reset
            console.log('Server response:', data);

            setFoundTable(data.table);  // Save the user table found (used later for update)
            console.log('Table found:', data.table);

            // Generate a random 6-digit verification code
            const code = Math.floor(100000 + Math.random() * 900000);
            setGeneratedCode(code);

            // Send the verification code to the user's email via external email service
            const sendCodeResponse = await fetch(`${SEND_URL}/reg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            if (!sendCodeResponse.ok) {
                throw new Error(`Error sending verification code: ${sendCodeResponse.status}`);
            }

            setStep(2); // Proceed to step 2 - verification code input
        } else if (response.status === 403) {
            // Email belongs to a Gmail account or cannot be changed
            setEmailError(data.message || 'Cannot change password for Gmail accounts.');
        } else if (response.status === 404) {
            // Email not found in database
            setEmailError(data.message || 'Email not found');
        } else {
            // Other unexpected errors
            setEmailError('An unexpected error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error during email submission:', error);
        setEmailError('An error occurred. Please try again.');
    }
};

  // Handler to verify the user input verification code matches the generated one
  const handleCodeSubmit = () => {
    if (verificationCode === String(generatedCode)) {
      setStep(3);  // Move to step 3 - new password input
    } else {
      setEmailError('Incorrect verification code'); // Show error if codes don't match
    }
  };

  // Handler to submit the new password to the backend for updating
  const handlePasswordSubmit = async () => {
    setPasswordError('');  // Clear previous password errors

    // Validate that both password fields are filled
    if (newPassword.trim() === '' || repeatPassword.trim() === '') {
        setPasswordError('Please fill in all fields');
        return;
    }

    // Validate that new password and repeat password match
    if (newPassword !== repeatPassword) {
        setPasswordError('Passwords do not match');
        return;
    }

    console.log('Submitting password update for:', email, 'in table:', foundTable);

    try {
        // Send PATCH request to update the password in the backend
        const response = await fetch(`${BACKEND_URL}/update-password`, {
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
            // If password updated successfully, navigate to login page
            navigate('/login');
        } else {
            setPasswordError(data.message || 'Failed to update password');
        }
    } catch (error) {
        console.error('Error during password update:', error);
        setPasswordError('An error occurred. Please try again.');
    }
};

  // Handler to navigate back to login page
  function handleGoLogin(){
    navigate('/login');
  }

  // JSX render for the password restoration form with conditional rendering per step
  return (
    <div className="body_login">
      <UpBar_Log/>
      <form className="form_login">
        <h1 className="title">Restore Password</h1>

        {/* Step 1: Enter email */}
        {step === 1 && (
          <div className="field_container">
            <input
              value={email}
              placeholder="Enter your email here"
              onChange={(ev) => setEmail(ev.target.value)}
              className="inputBox"
            />
            <label className="errorLabel">{emailError}</label>
            <button type="button" onClick={handleEmailSubmit} className="Login_btn" style={{width:'104%'}}>
              Submit
            </button>
            <br />
            <button type="button" onClick={handleGoLogin} className="Login_btn" style={{width:'104%'}}>
              Back
            </button>
          </div>
        )}

        {/* Step 2: Enter verification code */}
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

        {/* Step 3: Enter new password and confirmation */}
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
