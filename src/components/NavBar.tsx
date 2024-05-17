import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";



const NavBar = ({}) => {
    const [menuTab, setActiveTab] = useState('home')

    const handleTabClick = (tab:string, event: React.MouseEvent) => {
        event.preventDefault();
        setActiveTab(tab);
    }
    console.log(menuTab)
    return (
        <div className="main-sidebar">
            <div className="sidebar-brand">
                <a href="/">
                    <img className="light-image" src={antidoteEmblem} alt=""></img>
                    <img className="dark-image" src={antidoteEmblem} alt=""></img>
                </a>
            </div>
            <div className="sidebar-inner">
                <div 
                    className="naver" 
                    // style="margin-top: 150px;"
                > 
                </div>

                <ul className="icon-menu">
                    <li>
                        <a 
                            href="/" 
                            id="home-sidebar-menu" 
                            data-content="Dashboards" 
                            onClick={(e) => handleTabClick('home', e)}
                            className={menuTab === 'home' ? "is-selected is-active" : ""}
                        >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity sidebar-svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </a>
                    </li>
                    <li>
                        <a 
                            href="/table" 
                            id="layouts-sidebar-menu" 
                            data-content="Layouts"
                            onClick={(e) => handleTabClick('table', e)}
                            className={menuTab === 'table' ? "is-selected is-active" : ""} 
                        >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid sidebar-svg"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </a>
                    </li>
                    {/* <li>
                        <a href="elements-hub.html" id="elements-sidebar-menu" data-content="Elements">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box sidebar-svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        </a>
                    </li>
                    <li>
                        <a href="components-hub.html" id="components-sidebar-menu" data-content="Components">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-cpu sidebar-svg"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                        </a>
                    </li>
                    <li id="messages-menu">
                        <a href="admin-messaging-chat.html" id="open-messages" data-content="Messaging">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle sidebar-svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                    </li> */}
                </ul>

                <ul className="bottom-menu">
                    <li className="right-panel-trigger" data-panel="search-panel">
                        <a href="javascript:void(0);" id="open-search" data-content="Search"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search sidebar-svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></a>
                        <a href="javascript:void(0);" id="close-search" className="is-hidden is-inactive"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x sidebar-svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></a>
                    </li>
                    <li>
                        <a href="/admin-profile-settings.html" id="open-settings" data-content="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings sidebar-svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </a>
                    </li>
                    <li id="user-menu">
                        <div id="profile-menu" className="dropdown profile-dropdown dropdown-trigger is-spaced is-up">
                            <img src="assets/img/avatars/photos/8.jpg" data-demo-src="assets/img/avatars/photos/8.jpg" alt=""></img>
                            <span className="status-indicator"></span>

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
                                    <a href="/admin-profile-view.html" className="dropdown-item is-media">
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
                    </li>
                </ul>
            </div>
        </div>
    )
};


export default NavBar;