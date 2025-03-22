import React, { useContext } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { AppContext } from './AppContext';


function GoogleBtn({ onSuccessLogin, isRegister = false }) {  
    const { setName, setEmail, setDecodedToken, setLogined, type, setType, handleLogin } = useContext(AppContext);

    const responseMessage = (response) => {
        try {
            const decodedToken = jwtDecode(response.credential);
            const firstName = decodedToken.given_name;
            const lastName = decodedToken.family_name;
            const email = decodedToken.email;

            if (!isRegister) {
                
                setName(`${firstName} ${lastName}`);
                setEmail(email);
                setDecodedToken(decodedToken);
                setLogined(true);
                handleLogin(`${firstName} ${lastName}`, email, type);
            }

            console.log('Login Success:', decodedToken);
            onSuccessLogin(decodedToken); 
        
        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    };

    return (
        <div>
            <GoogleLogin onSuccess={responseMessage} onError={(error) => console.log('Login Failed:', error)} />
        </div>
    );
}

export default GoogleBtn;
