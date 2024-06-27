import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import feather from 'feather-icons';
import { API_BASE_URL } from '../config';


interface ResetPasswordParams {
    token: string;
}

const ResetPassword = () => {
    const { token } = useParams<ResetPasswordParams>(); // Get the token from the URL
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const history = useHistory();
    const notyf = new Notyf();

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();
        

        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include at least one special character.');
            notyf.error('Password must be at least 8 characters long and include at least one special character.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            notyf.error('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/reset_password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                notyf.error('Error: Password reset failed!');
                throw new Error('Invalid password');
            }
            notyf.success('Password reset successful!');
            history.push('/');
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

    console.log('Token',token)
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
                        <h2>Reset Password</h2>
                        <p>Please reset your password below.</p>
                    </div>
                    <div className="form-card">
                        <form onSubmit={handleResetPassword}>
                            <div id="signin-form" className="login-form">
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
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <span className="form-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
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

export default ResetPassword;
