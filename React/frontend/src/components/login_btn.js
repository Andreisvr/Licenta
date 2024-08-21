import React from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    const responseMessage = (response) => {
        console.log('Login Success:', response);
        navigate('/main');
    };

    const errorMessage = (error) => {
        console.log('Login Failed:', error);
    };

    const handleLogout = () => {
        googleLogout();
        console.log('User logged out');
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            <br />
            <br />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default LoginPage;
