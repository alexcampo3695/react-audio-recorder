import React, { useEffect, useState, ReactElement, useContext } from 'react';
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import loginImage from "../styles/assets/login_img.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import backendUrl from '../config';


type LoginCredentials = {
    email: string;
    password: string
}


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUser } = useUser();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const loginCredentials: LoginCredentials = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(`${backendUrl}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginCredentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 403 && errorData.message === 'User account is deactivated') {
                    throw new Error('Your account has been deactivated. Please contact support.');
                }
                throw new Error('Invalid email or password');
            }

            const data = await response.json();
            if (data) {
                const userData = {
                    id: data.id,
                    email: data.email,
                    role: data.role
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                console.log('User data:', userData);

                navigate('/authentication', { state: { data } });
            } else {
                throw new Error('User data is missing from the response');
            }

            navigate('/authentication', { state: { loginCredentials } });
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }


    return (
        <div className="modern-login">
            <div className="underlay h-hidden-mobile h-hidden-tablet-p"></div>
            <div className="columns is-gapless is-vcentered">
                <div className="column is-relative is-8 h-hidden-mobile h-hidden-tablet-p">
                    <div className="hero is-fullheight is-image">
                        <div className="hero-body">
                            <div className="container">
                                <div className="columns">
                                    <div className="column">
                                        <img className="hero-image" src={loginImage} alt="Station Illustration" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column is-4 is-relative">
                    <a className="top-logo" href="/">
                        <img className="light-image" src={antidoteEmblem} alt="Logo" />
                        <img className="dark-image" src={antidoteEmblem} alt="Light Logo" />
                    </a>
                    <label className="dark-mode ml-auto">
                        <input type="checkbox" defaultChecked />
                        <span></span>
                    </label>
                    <div className="is-form">
                        <div className="hero-body">
                            <div className="form-text">
                                <h2>Sign In</h2>
                                <p>Welcome back to your account.</p>
                            </div>
                            {error && <div className="notification is-danger">{error}</div>}
                            <form id="login-form" className="login-wrapper" onSubmit={handleLogin}>
                                <div className="control has-validation">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <small className="error-text">This is a required field</small>
                                    <div className="auth-label">Email Address</div>
                                    <div className="auth-icon">
                                        <i className="lnil lnil-envelope"></i>
                                    </div>
                                </div>
                                <div className="control has-validation">
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="auth-label">Password</div>
                                    <div className="auth-icon">
                                        <i className="lnil lnil-lock-alt"></i>
                                    </div>
                                </div>

                                <div className="control is-flex">
                                    <label className="remember-toggle">
                                        <input type="checkbox" />
                                        <span className="toggler">
                                            <span className="active">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </span>
                                            <span className="inactive">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>
                                            </span>
                                        </span>
                                    </label>
                                    <div className="remember-me">Remember Me</div>
                                    <a
                                        id="forgot-link"
                                        href = "/forgot-password"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="button-wrap has-help">
                                    <button id="login-submit" type="submit" className="button h-button is-big is-rounded is-primary is-bold is-raised">
                                        Login Now
                                    </button>
                                    <span>Or <a href="/register">Create</a> an account.</span>
                                </div>
                            </form>

                            <form id="recover-form" className="login-wrapper is-hidden">
                                <p className="recover-text">
                                    Enter your email and click on the confirm button to reset your
                                    password. We'll send you an email detailing the steps to complete
                                    the procedure.
                                </p>
                                <div className="control has-validation">
                                    <input type="text" className="input" placeholder="Email Address" />
                                    <small className="error-text">This is a required field</small>
                                    <div className="auth-label">Email Address</div>
                                    <div className="auth-icon">
                                        <i className="lnil lnil-envelope"></i>
                                    </div>
                                    <div className="validation-icon is-success">
                                        <div className="icon-wrapper">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    </div>
                                    <div className="validation-icon is-error">
                                        <div className="icon-wrapper">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="button-wrap">
                                    <button id="cancel-recover" type="button" className="button h-button is-white is-big is-rounded is-lower">
                                        Cancel
                                    </button>
                                    <button type="button" className="button h-button is-solid is-big is-rounded is-lower is-raised is-colored">
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
