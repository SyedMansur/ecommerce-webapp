import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

interface User {

  firstName: string;
  lastName: string;
  address: string;
  emailId: string;
  password: string;
  userId: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  address?: string;
  emailId?: string;
  password?: string;
  userId?: string;
  submit?: string;
}

const UserRegistration: React.FC = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    address: '',
    emailId: '',
    password: '',
    userId: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!user.firstName) newErrors.firstName = 'First name is required';
    if (!user.lastName) newErrors.lastName = 'Last name is required';
    if (!user.emailId) newErrors.emailId = 'Email id is required';
    if (!user.password) newErrors.password = 'Password is required';
    if (!user.userId) newErrors.userId = 'User id is required';
    // if (!user.address) newErrors.address = 'Passwords is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    if (!validate()) {
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
      });

      const conotentType = response.headers.get('content-type');

      if (response.ok) {
        if (conotentType && conotentType.includes('application/json')) {

          const json = await response.json();
          setErrors({ submit: json.message });
        } else if (response.status === 200) {

          alert("User registration successfully! Redirecting to login...");
          toast.success("Registration successfull!");

          setTimeout(() => {

            navigate('/login');
          }, 1000);
        }
      } else {

        const data = await response.json();
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {

      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <div>
      <div className="page-center">
        <div className="form-container">
          <div className='page-header'>
            <h2>User Registration</h2>
          </div>
          <div className='register-form'>
            <div>
              <label>
                First Name
                <span style={{ color: 'red' }}> *</span>
              </label>
              <input name="firstName" value={user.firstName} onChange={handleChange} />
              {errors.firstName && <span>{errors.firstName}</span>}
            </div>

            <div>
              <label>Last name
                <span style={{ color: 'red' }}> *</span>
              </label>
              <input name="lastName" value={user.lastName} onChange={handleChange} />
              {errors.lastName && <span>{errors.lastName}</span>}
            </div>

            <div>
              <label>Address
              <span style={{ color: 'red' }}> *</span>
              </label>
              <input name="address" value={user.address} onChange={handleChange} />
              {errors.address && <span>{errors.address}</span>}
            </div>

            <div>
              <label>Email Id
              <span style={{ color: 'red' }}> *</span>
              </label>
              <input name="emailId" value={user.emailId} onChange={handleChange} />
              {errors.emailId && <span>{errors.emailId}</span>}
            </div>

            <div>
              <label>Password
              <span style={{ color: 'red' }}> *</span>
              </label>
              <input name="password" value={user.password} onChange={handleChange} />
              {errors.password && <span>{errors.password}</span>}
            </div>

            <div>
              <label>User Id
              <span style={{ color: 'red' }}> *</span>
              </label>
              <input name="userId" value={user.userId} onChange={handleChange} />
              {errors.userId && <span>{errors.userId}</span>}
            </div>
          </div>
          <div className='register-button'>
            <button onClick={handleSubmit}>Register</button>
          </div>
          <p> Already have an account?
            <a href="/login">Login</a>
          </p>
          {errors.submit && <b style={{ color: 'red' }}>{errors.submit}</b>}
        </div>
      </div>

      <style>
        {`
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f6f8fa;
        }
        .page-center {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f6f8fa;
      }
      .page-header h2 {
          text-align: center;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          color: #24292e;
      }
      .form-container {
                background-color: #ffffff;
                padding: 2rem;
                border: 1px sold #d0d7de;
                border-radius: 1px;
                width: 340px;
                box-shadow: 0 1px 3px rgba(17, 83, 150, 0.1);
        }
      .form-container label {
            display: block;
            margin-bottom: 0.25rem;
            color: #24292e;
      }
      .form-container input {
        width: 100%;
        padding: 5px;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .form-container .success {
        color: green;
        margin-bottom: 12px;
      }
      .form-container span {
        color: red;
        font-size: 0.9em;
      }
        .register-button {
            display: flex;
            justify-content: center;
            margin-top: 1rem;
        }
        .register-button button {
            background-color: #2da44e;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        }
          .register-button button:hover {
                background-color: #218739;
        }
    `}
      </style>
    </div>
  );
};

export default UserRegistration;