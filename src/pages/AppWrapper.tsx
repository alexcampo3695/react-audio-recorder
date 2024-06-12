import React, { useEffect, useState, ReactElement } from 'react';
import NavBar from '../components/NavBar';
import MobileNav from '../components/MobileNav';
import '../styles/huro/scss/main.scss';
import { IonHeader, IonToolbar, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, isPlatform } from '@ionic/react';
import { home, person, settings } from 'ionicons/icons';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';

import '@ionic/react/css/normalize.css'

// basic css
import '@ionic/react/css/normalize.css'


interface AppWrapperProps {
    children: ReactElement;
    title: string;
}

const AppWrapper = ({ children, title }: AppWrapperProps) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleBodyClass = () => {
        const body = document.querySelector('body');
        if (darkMode) {
            body?.classList.add('is-dark');
        } else {
            body?.classList.remove('is-dark');
        }
    };

    useEffect(() => {
        toggleBodyClass();
    }, [darkMode]);

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        document.body.style.paddingTop = 'env(safe-area-inset-top)';
        document.body.style.paddingLeft = 'env(safe-area-inset-left)';
        document.body.style.paddingRight = 'env(safe-area-inset-right)';
        document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
    }, []);

    useEffect(() => {
        const setViewportHeight = () => {
          document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
      
        window.addEventListener('resize', setViewportHeight);
        setViewportHeight();
      
        return () => {
          window.removeEventListener('resize', setViewportHeight);
        };
      }, []);
      

    return (
        <>
            <div 
                className="view-wrapper" 
                style={{ padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }} 
                data-naver-offset="150" 
                data-menu-item="#home-sidebar-menu" 
                data-mobile-item="#home-sidebar-menu-mobile"
            >
                {!isPlatform('ios') && <MobileNav />}
                <NavBar />
                <div className="page-content-wrapper">
                    <div className="page-content is-relative">
                        <div className="page-title has-text-centered">
                            <div className="huro-hamburger nav-trigger push-resize" data-sidebar="home-sidebar">
                                <span className="menu-toggle has-chevron">
                                    <span className="icon-box-toggle">
                                        <span className="rotate">
                                            <i className="icon-line-top"></i>
                                            <i className="icon-line-center"></i>
                                            <i className="icon-line-bottom"></i>
                                        </span>
                                    </span>
                                </span>
                            </div>

                            <div className="title-wrap">
                                <h1 className="title is-4">{title}</h1>
                            </div>
                            <div className="toolbar ml-auto">
                                <div className="toolbar-link">
                                    <label className="dark-mode ml-auto">
                                        <input 
                                            type="checkbox" 
                                            checked={darkMode}
                                            onChange={handleDarkModeToggle}
                                        />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="page-content-inner">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            { isPlatform('ios') && (
                <IonTabs>
                    <IonRouterOutlet>
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile" element={<Home />} />
                        </Routes>
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="home" href="/home">
                            <IonIcon icon={home} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="profile" href="/home">
                            <IonIcon icon={person} />
                            <IonLabel>Profile</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            )}
        </>
    );
}

export default AppWrapper;
