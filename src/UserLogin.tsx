// src/components/Login.tsx

import { error } from 'console';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserLogin: React.FC = () => {

    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');

    const [credentials, setCredentials] = useState({
        emailId: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCredentials({
            ...credentials, [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { emailId, password } = credentials;
    try {
        const response = await fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            const result = await response.json();
            const { roleId, token } = result.data;

            localStorage.setItem('user', JSON.stringify(result.data));
            if (token) {
                localStorage.setItem('token', token);
            }

            toast.success("Login successful!", {
                autoClose: 1000
            });

            setTimeout(() => {
                if (roleId === 1) {
                    navigate("/home");
                } else if (roleId === 0) {
                    navigate("/Product/Dashboard");
                } else {
                    toast.error("Unknown role. Please contact support.");
                }
            }, 1000);
        } else {
            const error = await response.json();
            setErrorMsg(error.message);
        }
    } catch (error) {
        toast.error('Something went wrong');
        console.error('Login error:', error);
    }
};


    return (
        <div>
            <div className='login-container'>
                <form onSubmit={handleLogin} className='login-form'>
                    <h2>Login</h2>
                    <div>
                        <label>Email Id</label>
                        <input
                            type='email'
                            name='emailId'
                            value={credentials.emailId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type='password'
                            name='password'
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='forgot-password-links'>
                        <a href='/forgot-password'>Forgot password?</a>
                    </div>
                    <div className='login-button-wrapper'>
                        <button type="submit">Login</button>
                    </div>
                    <div className='register-links'>
                        {/* <a href='/forgot-password'>Forgot password?</a> */}
                        {/* <span>.</span> */}
                        <a href='/register'>Register</a>
                    </div>
                    {errorMsg && <b /*style={{ color: 'red' }}*/>{errorMsg}</b>}
                </form>
            </div>

            <style> {`
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f6f8fa;
        }
        .login-container{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 75vh;
        }
        .login-form {
                background-color: #ffffff;
                padding: 2rem;
                border: 1px sold #d0d7de;
                border-radius: 6px;
                width: 340px;
                margin-bottom: 0.5rem;
                box-shadow: 0 1px 3px rgba(17, 83, 150, 0.1);
        }
        
        .login-form h2 {
            text-align: center;
            margin-bottom: 0.25rem;
            color: #24292e;
        }
        .login-form label {
            display: block;
            margin-bottom: 0.25rem;
            color: #24292e;
        }
        .login-form input {
            width: 100%;
            padding: 0.5rem 1px;
            border: 1px solid #d0d7de
            border-radius: 6px;
            fornt-size: 1rem;
            margin-bottom: 1rem;
        }
        .login-button-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 1rem;
        }
        .login-button-wrapper button {
            height: 100%;
            width: 60%;
            color: white;
            padding: 0.5rem 15px;
            font-size: 17px;
            font-weight: 500;
            border-radius: 100px;
            background-color: #2da44e;
            border: none;
            cursor: pointer;
        }
        .login-button-wrapper button:hover {
                background-color:rgb(4, 133, 34);
        }   

        b {
        display: block;
        text-align: center;
        margin-top: 1rem;
        color: red;
        }

        // .register-links- {
        // margin-top: #0969da;
        // text-align: center;
        // font-size: 0.9rem;
        // }

        .register-links a {
            color: #0969da;
            text-decoration: none;
            margin: 0 0.5rem;
        }

        .register-links a:hover {
                text-decoration: underline;
        }

        .forgot-password-links {
        margin-top: 0.25rem;
        text-align: right;
        // font-size: 0.9rem;
        }

        .forgot-password-links a {
            color: #0969da;
            text-decoration: none;
            // margin: 0 0.5rem;
            font-size: 0.85rem;
        }

        .forgot-password-links a:hover {
            text-decoration: underline;
        }
    `}
            </style>
        </div>
    );
};

export default UserLogin;
