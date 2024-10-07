import React, {useContext}from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // cu underscore
import { AppContext } from './AppContext'; // Importă contextul


function LoginPage() {
    
    const { setName, setEmail, setDecodedToken, setLogined } = useContext(AppContext);

    const responseMessage = (response) => {
        try {
            const decodedToken = jwtDecode(response.credential);
            const firstName = decodedToken.given_name;
            const lastName = decodedToken.family_name;
            const email = decodedToken.email;

            setName(`${firstName} ${lastName}`);
            setEmail(email);
            setDecodedToken(decodedToken);
            setLogined(true);

            console.log('Email:', email);
            console.log('Login Success:', decodedToken);
            console.log('First Name:', firstName);
            console.log('Last Name:', lastName);

            
        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    };

    const errorMessage = (error) => {
        console.log('Login Failed:', error);
    };

    const handleLogout = () => {
        googleLogout();
        setName(`${''} ${''}`);
        setEmail('');
        setDecodedToken('');
        setLogined(false);

        console.log('Email:', 'email');
        console.log('Login Success:', 'decodedToken');
        console.log('First Name:', 'firstName');
        console.log('Last Name:', 'lastName');

        console.log('User logged out');
    };

    return (
        <div>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            <br/>
        </div>
    );
}

export default LoginPage;
