// Updated Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check URL for token after OAuth redirect
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            navigate('/'); // redirect to main app page
        }
    }, [navigate]);

    const handleLoginClick = () => {
        // Redirect to Spring Boot OAuth endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Login</h2>
            <button onClick={handleLoginClick}>
                Login with Google
            </button>
        </div>
    );
};

export default Login;
