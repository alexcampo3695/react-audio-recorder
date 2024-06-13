import React, { useEffect } from 'react';
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import feather from 'feather-icons';

const ForgotPassword = () => {
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');
    const notyf = new Notyf();

    async function handleForgotPassword(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/user/forgot_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                notyf.error('Error: Email not found!');
                throw new Error('Invalid email');
            }
            notyf.success('Password reset link sent to email!');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
                setError(error.message);
                notyf.error(error.message);
            } else {
                setError('An unknown error occurred');
                notyf.error('An unknown error occurred');
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
                        <h2>Reset Your Password.</h2>
                        <p>Enter your email address below.</p>
                    </div>
                    <div className="form-card">
                        <form onSubmit={handleForgotPassword}>
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
                                <div className="control login">
                                    <button className="button h-button is-primary is-bold is-fullwidth is-raised">
                                        Reset Password
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

export default ForgotPassword;
