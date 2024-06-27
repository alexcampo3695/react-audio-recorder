import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import loginImage from "../styles/assets/login_img.png";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import feather from 'feather-icons';
import { API_BASE_URL } from '../config';

const Register = () => {
    const [role, setRole] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const history = useHistory();
    const notyf = new Notyf();
    

    async function handleRegistration(e: React.FormEvent) {
        e.preventDefault();

        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include at least one special character.');
            notyf.error('Password must be at least 8 characters long and include at least one special character.');
            return;
        }

        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            notyf.error('Passwords do not match.');
            return;
        }

        const userRegistration = {
            email: email,
            password: password,
            role: role
        };

        try {
<<<<<<< HEAD
            const response = await fetch(`${API_BASE_URL}/api/user`, {
=======
            const response = await fetch('/api/user', {
>>>>>>> 9012301133c1efa5e3e08e5b483030ef462be5fc
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRegistration),
            });

            if (!response.ok) {
                // throw new Error('Invalid registration');
                notyf.error('Error: Email already exists!');
                throw new Error('Invalid registration');
            }

            const data = await response.json();
            notyf.success('Registration successful!');
            console.log('Registration successful:', data);
            history.push('/', { state: { userRegistration } });
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    useEffect(() => {
        feather.replace();
      }, []);

      return (
        <div className="auth-wrapper-inner is-single">
            <div className="auth-nav">
                <div className="left"></div>
                <div className="center">
                    <a href="/" className="header-item">
                        <img className="light-image" src={antidoteEmblem} alt="Logo" />
                        <img className="dark-image" src={antidoteEmblem} alt="Logo" />
                    </a>
                </div>
                <div className="right">
                    <label className="dark-mode ml-auto">
                        <input type="checkbox" defaultChecked />
                        <span></span>
                    </label>
                </div>
            </div>
            <div className="single-form-wrap">
                <div className="inner-wrap">
                    <div className="auth-head">
                        <h2>Join Us Now.</h2>
                        <p>Start by creating your account</p>
                        <a href="/">I already have an account </a>
                    </div>
                    <div className="form-card">
                        <form onSubmit={handleRegistration}>
                            <div id="signin-form" className="login-form">
                                <div className="field">
                                    <div className="control has-icon">
                                        <input 
                                            className="input" 
                                            type="text" 
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <span className="form-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control has-icon">
                                        <input 
                                            className="input" 
                                            type="password" 
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <span className="form-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control has-icon">
                                        <input 
                                            className="input" 
                                            type="password" 
                                            placeholder="Repeat Password"
                                            value={repeatPassword}
                                            onChange={(e) => setRepeatPassword(e.target.value)}
                                            required
                                        />
                                        <span className="form-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Are you a provider or a patient?</label>
                                    <div className="control">
                                        <label className="radio is-outlined is-primary">
                                            <input 
                                                type="radio" 
                                                name="notification_selection" 
                                                onClick={() => setRole('provider')}
                                                required
                                            />
                                            <span></span>
                                            Provider
                                        </label>

                                        <label className="radio is-outlined is-primary">
                                            <input 
                                                type="radio" 
                                                name="notification_selection"
                                                onClick={() => setRole('patient')}
                                                required
                                            />
                                            <span></span>
                                            Patient
                                        </label>
                                    </div>
                                </div>
                                <div className="control login">
                                    <button className="button h-button is-primary is-bold is-fullwidth is-raised">
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </form>
                        {error && <p className="error-text">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
