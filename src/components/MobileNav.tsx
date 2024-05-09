import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";


const MobileNav = ({}) => {
    return (
        <nav className="navbar mobile-navbar no-shadow is-hidden-desktop is-hidden-tablet" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <div className="brand-start">
                        <div className="navbar-burger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <a className="navbar-item is-brand" href="index.html">
                        <img className="light-image" src={antidoteEmblem} alt=""></img>
                        <img className="dark-image" src={antidoteEmblem} alt=""></img>
                    </a>

                    <div className="brand-end">
                        <div className="navbar-item has-dropdown is-notification is-hidden-tablet is-hidden-desktop">
                            <a className="navbar-link is-arrowless" href="javascript:void(0);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
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
                                                    <img className="user-photo" alt="" src="assets/img/avatars/photos/7.jpg" data-demo-src="assets/img/avatars/photos/7.jpg"></img>
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
                                                    <img className="user-photo" alt="" src="assets/img/avatars/photos/12.jpg" data-demo-src="assets/img/avatars/photos/12.jpg"></img>
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
                                                    <img className="user-photo" alt="" src="assets/img/avatars/photos/13.jpg" data-demo-src="assets/img/avatars/photos/13.jpg"></img>
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
                                                    <img className="user-photo" alt="" src="assets/img/avatars/photos/25.jpg" data-demo-src="assets/img/avatars/photos/25.jpg"></img>
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
                                    <img className="avatar" src="assets/img/avatars/photos/8.jpg" data-demo-src="assets/img/avatars/photos/8.jpg" alt=""></img>
                                </div>
                            </div>
                            <div className="dropdown-menu" role="menu">
                                <div className="dropdown-content">
                                    <div className="dropdown-head">
                                        <div className="h-avatar is-large">
                                            <img className="avatar" src="assets/img/avatars/photos/8.jpg" data-demo-src="assets/img/avatars/photos/8.jpg" alt=""></img>
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
                                    <hr className="dropdown-divider"></hr>
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
                                    <hr className="dropdown-divider"></hr>
                                    <a href="#" className="dropdown-item is-media">
                                        <div className="icon">
                                            <i className="lnil lnil-cog"></i>
                                        </div>
                                        <div className="meta">
                                            <span>Settings</span>
                                            <span>Account settings</span>
                                        </div>
                                    </a>
                                    <hr className="dropdown-divider"></hr>
                                    <div className="dropdown-item is-button">
                                        <button className="button h-button is-primary is-raised is-fullwidth logout-button">
                                            <span className="icon is-small">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
    )
};


export default MobileNav;