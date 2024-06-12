import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import feather from 'feather-icons';


interface LoginCredentials {
    email: string;
    password: string;
}

interface LocationState {
    loginCredentials?: LoginCredentials;
  }
  

const TwoFactorAuth = () => {
    const location = useLocation();
    const state = useState();
    const [ twoFactorCode, setTwoFactorCode ] = React.useState('');
    const [ error, setError ] = React.useState('');
    const navigate = useNavigate();
    const notyf = new Notyf();

    const loginCredentials = useMemo(() => {
        const state = location.state as LocationState;
        console.log('Derived state:', state);
        return state?.loginCredentials ?? null;  
      }, [location.state]); 

    const email = loginCredentials?.email;

    async function handleTwoFactorAuthetication(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/user/verify_2fa/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, twoFactorCode }),
            });

            const data = await response.json();

            if (response.ok) {
                notyf.success('Login successful');
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                notyf.error(data.message);
            }
        } catch (error) {
            notyf.error('Verification failed');
        }
    }

    useEffect(() => {
        feather.replace();
    }, []);

    console.log('Email',email)

    return (
        <div className="auth-wrapper-inner is-single">
            <div className="auth-nav">
                <div className="left"></div>
                <div className="center">
                    <a href="/" className="header-item" style= {{paddingTop: '60px'}}>
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
                        <h2>Verify Your Identity</h2>
                        <p>Check your email for a code.</p>
                    </div>
                    <div className="form-card">
                        <form onSubmit={handleTwoFactorAuthetication}>
                            <div id="signin-form" className="login-form">
                                <div className="field">
                                    <div className="control has-icon">
                                        <input 
                                            className="input" 
                                            type="text" 
                                            placeholder="Enter Code"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value)}
                                            required
                                        />
                                        <span className="form-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="control login">
                                    <button className="button h-button is-primary is-bold is-fullwidth is-raised">
                                        Login
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

export default TwoFactorAuth;
