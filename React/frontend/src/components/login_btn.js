import React, { useContext } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';  // Google OAuth components
import {jwtDecode} from 'jwt-decode';  // Library to decode JWT tokens
import { AppContext } from './AppContext';  // Import app context for global state

function GoogleBtn({ onSuccessLogin, isRegister = false }) {  
    // Destructure setters and values from the global AppContext
    const { setName, setEmail, setDecodedToken, setLogined, type, setType, handleLogin } = useContext(AppContext);

    // Handler for successful Google login response
    const responseMessage = (response) => {
        try {
            // Decode the JWT credential returned by Google
            const decodedToken = jwtDecode(response.credential);
            const firstName = decodedToken.given_name;  // Extract user's first name
            const lastName = decodedToken.family_name;  // Extract user's last name
            const email = decodedToken.email;           // Extract user's email

            // If this is not a registration flow, update context and localStorage
            if (!isRegister) {
                setName(`${firstName} ${lastName}`);    // Set user's full name in context
                setEmail(email);                         // Set user's email in context
                setDecodedToken(decodedToken);          // Store decoded JWT token
                setLogined(true);                        // Set login status to true
                handleLogin(`${firstName} ${lastName}`, email, type);  // Trigger login handler
            }

            // Log the successful login and pass decoded token to parent callback
            console.log('Login Success:', decodedToken);
            onSuccessLogin(decodedToken); 
        
        } catch (error) {
            // Handle errors that occur during JWT decoding
            console.error('Error decoding JWT:', error);
        }
    };

    // Render the Google login button with success and error handlers
    return (
        <div>
            <GoogleLogin onSuccess={responseMessage} onError={(error) => console.log('Login Failed:', error)} />
        </div>
    );
}

export default GoogleBtn;
