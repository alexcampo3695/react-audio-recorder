import React, { useState, useEffect } from "react";
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import { useUser } from '../context/UserContext';
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import { useHistory } from "react-router-dom";
import { API_BASE_URL } from "../config";

const NavBar = () => {
    const { user } = useUser();
    const history = useHistory();
    const [menuTab, setActiveTab] = useState('home');
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
    const [settingMenu, setSettingMenu] = useState(false);

    const handleTabClick = (tab: string, path: string, event: React.MouseEvent) => {
        event.preventDefault();
        setActiveTab(tab);
        history.push(path);
    }

    useEffect(() => {
        console.log('NavBar user:', user);
    }, [user]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                try {
<<<<<<< HEAD
                    const response = await fetch(`${API_BASE_URL}/api/user_details/${user.id}`);
=======
                    const response = await fetch(`/api/user_details/${user.id}`);
>>>>>>> 9012301133c1efa5e3e08e5b483030ef462be5fc
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
        <div className="main-sidebar">
            <div className="sidebar-brand">
                <a href="/home">
                    <img className="light-image" src={antidoteEmblem} alt=""></img>
                    <img className="dark-image" src={antidoteEmblem} alt=""></img>
                </a>
            </div>
            <div className="sidebar-inner">
                <div className="naver"></div>
                <ul className="icon-menu">
                    <li>
                        <a
                            href="/home"
                            id="home-sidebar-menu"
                            data-content="Dashboards"
                            onClick={(e) => handleTabClick('home', '/home', e)}
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
                            onClick={(e) => handleTabClick('table', '/table', e)}
                            className={menuTab === 'table' ? "is-selected is-active" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid sidebar-svg"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </a>
                    </li>
                </ul>

                <ul className="bottom-menu">
                    <li>
                        <a href="/profile_settings" id="open-settings" data-content="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings sidebar-svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </a>
                    </li>
                    <li id="user-menu">
                        <div
                            id="profile-menu"
                            onClick={() => setSettingMenu(!settingMenu)}
                            className={`dropdown profile-dropdown dropdown-trigger is-spaced is-up ${settingMenu ? 'is-active' : ''}`}
                        >
                            <FakeAvatar
                                FirstName={data.firstName !== '' ? data.firstName : 'U'}
                                LastName={data.lastName !== '' ? data.lastName : 'K'}
                                Size={AvatarSize.Medium}
                            />
                            <span className="status-indicator"></span>
                            <div className="dropdown-menu" role="menu">
                                <div className="dropdown-content">
                                    <div className="dropdown-head">
                                        <FakeAvatar
                                            FirstName={data.firstName !== '' ? data.firstName : 'U'}
                                            LastName={data.lastName !== '' ? data.lastName : 'K'}
                                            Size={AvatarSize.Large}
                                        />
                                        <div className="meta">
                                            <span>
                                                {data.firstName !== '' ? data.firstName : 'Uknown'}{' '}
                                                {data.firstName !== '' ? data.lastName : 'User'}
                                            </span>
                                            <span>
                                                {data.providerType !== '' ? data.providerType : 'Uknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <a href="/profile_settings" className="dropdown-item is-media">
                                        <div className="icon">
                                            <i className="lnil lnil-user-alt"></i>
                                        </div>
                                        <div className="meta">
                                            <span>Profile</span>
                                            <span>View your profile</span>
                                        </div>
                                    </a>
                                    <hr className="dropdown-divider"></hr>
                                    <div className="dropdown-item is-button">
                                        <button
                                            className="button h-button is-primary is-raised is-fullwidth logout-button"
                                            onClick={() => {
                                                localStorage.removeItem('user');
                                                window.location.href = '/';
                                            }}
                                        >
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
    );
};

export default NavBar;
