import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import { useUser } from "../context/UserContext";
import { useHistory } from "react-router-dom";


const MobileNav = () => {
    const [navbarActive, setNavBarActive] = useState(false);
    const { user } = useUser();
    const history = useHistory();
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
        practiceAddress: '',
        providerType: '',
        specialty: '',
        npiNumber: '',
        stateLicenseNumber: '',
        deaNumber: ''
    });

    useEffect(() => {
        console.log('MobileNav user:', user);
    }, [user]);
    

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                try {
                    const response = await fetch(`/api/user_details/${user.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user details');
                    }
                    const data = await response.json();
                    if (data) {
                        setData(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [user]);

    return (
        <>
            <nav 
                className="navbar mobile-navbar no-shadow is-hidden-desktop is-hidden-tablet" 
                aria-label="main navigation"
            >
                <div className="container">
                    <div className="navbar-brand">
                        <div className="brand-start">
                            <div 
                                className={`navbar-burger ${navbarActive ? 'is-active' : ''}`}
                                onClick={() => setNavBarActive(!navbarActive)}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>

                        <a className="navbar-item is-brand" href="/home">
                            <img className="light-image" src={antidoteEmblem} alt="Light Logo" />
                            <img className="dark-image" src={antidoteEmblem} alt="Dark Logo" />
                        </a>

                        <div className="brand-end">
                            <div className="navbar-item has-dropdown is-notification is-hidden-tablet is-hidden-desktop">
                                <a className="navbar-link is-arrowless" href="javascript:void(0);">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                    </svg>
                                    <span className="new-indicator pulsate"></span>
                                </a>
                                <div className="navbar-dropdown is-boxed is-right">
                                    <div className="heading">
                                        <div className="heading-left">
                                            <h6 className="heading-title">Notifications</h6>
                                        </div>
                                        <div className="heading-right">
                                            <a className="notification-link" href="#">See all</a>
                                        </div>
                                    </div>
                                    <div className="inner has-slimscroll">
                                        <ul className="notification-list">
                                            <li>
                                                <a className="notification-item">
                                                    <div className="img-left">
                                                        <img className="user-photo" alt="User" src="assets/img/avatars/photos/7.jpg" />
                                                    </div>
                                                    <div className="user-content">
                                                        <p className="user-info">
                                                            <span className="name">Alice C.</span> left a comment.
                                                        </p>
                                                        <p className="time">1 hour ago</p>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="notification-item">
                                                    <div className="img-left">
                                                        <img className="user-photo" alt="User" src="assets/img/avatars/photos/12.jpg" />
                                                    </div>
                                                    <div className="user-content">
                                                        <p className="user-info">
                                                            <span className="name">Joshua S.</span> uploaded a file.
                                                        </p>
                                                        <p className="time">2 hours ago</p>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="notification-item">
                                                    <div className="img-left">
                                                        <img className="user-photo" alt="User" src="assets/img/avatars/photos/13.jpg" />
                                                    </div>
                                                    <div className="user-content">
                                                        <p className="user-info">
                                                            <span className="name">Tara S.</span> sent you a message.
                                                        </p>
                                                        <p className="time">2 hours ago</p>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="notification-item">
                                                    <div className="img-left">
                                                        <img className="user-photo" alt="User" src="assets/img/avatars/photos/25.jpg" />
                                                    </div>
                                                    <div className="user-content">
                                                        <p className="user-info">
                                                            <span className="name">Melany W.</span> left a comment.
                                                        </p>
                                                        <p className="time">3 hours ago</p>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="dropdown is-right is-spaced dropdown-trigger user-dropdown">
                                <div className="is-trigger" aria-haspopup="true">
                                    <div className="profile-avatar">
                                        <img className="avatar" src="assets/img/avatars/photos/8.jpg" alt="Profile Avatar" />
                                    </div>
                                </div>
                                <div className="dropdown-menu" role="menu">
                                    <div className="dropdown-content">
                                        <div className="dropdown-head">
                                            <div className="h-avatar is-large">
                                                <img className="avatar" src="assets/img/avatars/photos/8.jpg" alt="Profile Avatar" />
                                            </div>
                                            <div className="meta">
                                                <span>Erik Kovalsky</span>
                                                <span>Product Manager</span>
                                            </div>
                                        </div>
                                        <a href="#" className="dropdown-item is-media">
                                            <div className="icon">
                                                <i className="lnil lnil-user-alt"></i>
                                            </div>
                                            <div className="meta">
                                                <span>Profile</span>
                                                <span>View your profile</span>
                                            </div>
                                        </a>
                                        <a className="dropdown-item is-media layout-switcher">
                                            <div className="icon">
                                                <i className="lnil lnil-layout"></i>
                                            </div>
                                            <div className="meta">
                                                <span>Layout</span>
                                                <span>Switch to admin/webapp</span>
                                            </div>
                                        </a>
                                        <hr className="dropdown-divider" />
                                        <a href="#" className="dropdown-item is-media">
                                            <div className="icon">
                                                <i className="lnil lnil-briefcase"></i>
                                            </div>
                                            <div className="meta">
                                                <span>Projects</span>
                                                <span>All my projects</span>
                                            </div>
                                        </a>
                                        <a href="#" className="dropdown-item is-media">
                                            <div className="icon">
                                                <i className="lnil lnil-users-alt"></i>
                                            </div>
                                            <div className="meta">
                                                <span>Team</span>
                                                <span>Manage your team</span>
                                            </div>
                                        </a>
                                        <hr className="dropdown-divider" />
                                        <a href="#" className="dropdown-item is-media">
                                            <div className="icon">
                                                <i className="lnil lnil-cog"></i>
                                            </div>
                                            <div className="meta">
                                                <span>Settings</span>
                                                <span>Account settings</span>
                                            </div>
                                        </a>
                                        <hr className="dropdown-divider" />
                                        <div className="dropdown-item is-button">
                                            <button className="button h-button is-primary is-raised is-fullwidth logout-button">
                                                <span className="icon is-small">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out">
                                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                        <polyline points="16 17 21 12 16 7"></polyline>
                                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                                    </svg>
                                                </span>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div 
                className={`mobile-main-sidebar ${navbarActive ? 'is-active' : ''}`}
            >
                <div className="inner">
                    <ul className="icon-side-menu">
                        <li>
                            <a href="/home" id="home-sidebar-menu-mobile" className="is-active">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="/table" id="layouts-sidebar-menu-mobile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </a>
                        </li>
                        {/* <li>
                            <a href="/elements-hub.html" id="elements-sidebar-menu-mobile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="/components-hub.html" id="components-sidebar-menu-mobile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-cpu">
                                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                    <rect x="9" y="9" width="6" height="6"></rect>
                                    <line x1="9" y1="1" x2="9" y2="4"></line>
                                    <line x1="15" y1="1" x2="15" y2="4"></line>
                                    <line x1="9" y1="20" x2="9" y2="23"></line>
                                    <line x1="15" y1="20" x2="15" y2="23"></line>
                                    <line x1="20" y1="9" x2="23" y2="9"></line>
                                    <line x1="20" y1="14" x2="23" y2="14"></line>
                                    <line x1="1" y1="9" x2="4" y2="9"></line>
                                    <line x1="1" y1="14" x2="4" y2="14"></line>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="/messaging-chat.html" id="open-messages-mobile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                            </a>
                        </li> */}
                    </ul>

                    <ul className="bottom-icon-side-menu">
                        {/* <li>
                            <a href="javascript:" className="right-panel-trigger" data-panel="search-panel">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </a>
                        </li> */}
                        <li>
                            <a href="/profile_settings">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* <div className="mobile-subsidebar is-active">
                <div className="inner">
                    <div className="sidebar-title">
                        <h3>Dashboards</h3>
                    </div>

                    <ul className="submenu">
                        <li className="has-children active">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Personal 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li className="is-active">
                                    <a className="is-submenu" href="/admin-dashboards-personal-1.html">
                                        <i className="lnil lnil-analytics-alt-1"></i>
                                        <span>Personal V1</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-personal-2.html">
                                        <i className="lnil lnil-pie-chart"></i>
                                        <span>Personal V2</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-personal-3.html">
                                        <i className="lnil lnil-stats-up"></i>
                                        <span>Personal V3</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Finance 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-finance-1.html">
                                        <i className="lnil lnil-analytics-alt-1"></i>
                                        <span>Analytics Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-finance-2.html">
                                        <i className="lnil lnil-stats-up"></i>
                                        <span>Stocks Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-finance-3.html">
                                        <i className="lnil lnil-credit-card"></i>
                                        <span>Sales Dashboard</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Banking 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-banking-1.html">
                                        <i className="lnil lnil-bank"></i>
                                        <span>Banking V1</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-banking-2.html">
                                        <i className="lnil lnil-bank"></i>
                                        <span>Banking V2</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-banking-3.html">
                                        <i className="lnil lnil-bank"></i>
                                        <span>Banking V3</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Business 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-business-1.html">
                                        <i className="lnil lnil-plane-alt"></i>
                                        <span>Flights Booking</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-business-2.html">
                                        <i className="lnil lnil-apartment"></i>
                                        <span>Company Board</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-business-3.html">
                                        <i className="lnil lnil-users-alt"></i>
                                        <span>HR Board</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-business-4.html">
                                        <i className="lnil lnil-graduate"></i>
                                        <span>Course Board</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-business-5.html">
                                        <i className="lnil lnil-briefcase"></i>
                                        <span>Jobs Board</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Lifestyle 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-lifestyle-1.html">
                                        <i className="lnil lnil-cardiology"></i>
                                        <span>Influencer</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-lifestyle-2.html">
                                        <i className="lnil lnil-cloud-sun"></i>
                                        <span>Hobbies</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-lifestyle-3.html">
                                        <i className="lnil lnil-hospital-alt-3"></i>
                                        <span>Health</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-lifestyle-4.html">
                                        <i className="lnil lnil-books"></i>
                                        <span>Writer</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-lifestyle-5.html">
                                        <i className="lnil lnil-video-alt-1"></i>
                                        <span>Video</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-lifestyle-6.html">
                                        <i className="lnil lnil-tshirt"></i>
                                        <span>Soccer</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Ecommerce 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-ecommerce-1.html">
                                        <i className="lnil lnil-cart"></i>
                                        <span>Ecommerce V1</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Maps 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-map-1.html">
                                        <i className="lnil lnil-map"></i>
                                        <span>Map View V1</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-map-2.html">
                                        <i className="lnil lnil-map"></i>
                                        <span>Map View V2</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Apps 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-apps-1.html">
                                        <i className="lnil lnil-pizza"></i>
                                        <span>Food Delivery</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-apps-2.html">
                                        <i className="lnil lnil-envelope"></i>
                                        <span>Inbox</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-messaging-chat.html">
                                        <i className="lnil lnil-bubble"></i>
                                        <span>Messaging V1</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/webapp-messaging-chat.html">
                                        <i className="lnil lnil-bubble"></i>
                                        <span>Messaging V2</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <a href="/wizard-v1.html">Wizard</a>
                        </li>
                        <li className="divider"></li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Charts 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-charts-apex.html">
                                        <i className="lnil lnil-pie-chart-alt"></i>
                                        <span>Apex Charts</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-charts-billboardjs.html">
                                        <i className="lnil lnil-bar-chart"></i>
                                        <span>Billboard JS</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Widgets 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-widgets-ui.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>UI Widgets</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-widgets-creative.html">
                                        <i className="lnil lnil-layout-alt-2"></i>
                                        <span>Creative Widgets</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-widgets-list.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>List Widgets</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-dashboards-widgets-stats.html">
                                        <i className="lnil lnil-layout-alt-2"></i>
                                        <span>Stat Widgets</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Form Layouts 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="/admin-form-layouts-1.html">
                                        <i className="lnil lnil-passport"></i>
                                        <span>Form Layout V1</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-form-layouts-2.html">
                                        <i className="lnil lnil-passport"></i>
                                        <span>Form Layout V2</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-form-layouts-3.html">
                                        <i className="lnil lnil-passport"></i>
                                        <span>Form Layout V3</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-form-layouts-4.html">
                                        <i className="lnil lnil-passport"></i>
                                        <span>Form Layout V4</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="/admin-form-layouts-5.html">
                                        <i className="lnil lnil-passport"></i>
                                        <span>Form Layout V5</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="has-children">
                            <div className="collapse-wrap">
                                <a href="javascript:void(0);" className="parent-link">Starters 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <ul>
                                <li>
                                    <a className="is-submenu" href="admin-blank-page-1.html">
                                        <i className="lnil lnil-layout"></i>
                                        <span>Regular Sidebar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="admin-blank-page-2.html">
                                        <i className="lnil lnil-layout"></i>
                                        <span>Curved Sidebar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="admin-blank-page-3.html">
                                        <i className="lnil lnil-layout"></i>
                                        <span>Colored Sidebar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="admin-blank-page-4.html">
                                        <i className="lnil lnil-layout"></i>
                                        <span>Curved Colored</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="webapp-blank-page-1.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>Regular Navbar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="webapp-blank-page-2.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>Fading Navbar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="webapp-blank-page-3.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>Colored Navbar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="webapp-blank-page-4.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>Dropdown Navbar</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="is-submenu" href="webapp-blank-page-5.html">
                                        <i className="lnil lnil-layout-alt-1"></i>
                                        <span>Colored Dropdown</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div> */}
        </>
    );
};

export default MobileNav;