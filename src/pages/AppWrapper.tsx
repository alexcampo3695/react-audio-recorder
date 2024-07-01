import React, { useEffect, useState, ReactElement, useMemo } from 'react';
import NavBar from '../components/NavBar';
import MobileNav from '../components/MobileNav';
import '../styles/huro/scss/main.scss';
import { IonHeader, IonToolbar, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, isPlatform, IonPage } from '@ionic/react';

import '@ionic/react/css/normalize.css'
import '@ionic/react/css/core.css';
// import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


import NativeMenuTabs from '../components/NativeMenuTabs';
import IonicHeader from '../components/MobileHeader';
import MobileHeader from '../components/MobileHeader';


interface AppWrapperProps {
    children: ReactElement;
    title: string;
}

const AppWrapper = ({ children, title }: AppWrapperProps) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    console.log('Platform:', isPlatform('ios'))
      

    return (
        <>
            <MobileHeader />
            <div
                className={`view-wrapper ${isPlatform('ios') ? 'ios-padding-wrapper' : ''}`}
                data-naver-offset="150"
                data-menu-item="#home-sidebar-menu"
                data-mobile-item="#home-sidebar-menu-mobile"
            >
                {!isPlatform('ios') && <MobileNav />}
                <NavBar />
                <div className="page-content-wrapper">
                    <div className={`page-content is-relative ${isPlatform('ios') ? 'ios-padding' : ''}`}>
                        <div className="page-content-inner">
                        {children}
                        </div>
                    </div>
                </div>
                {isPlatform('ios') && <NativeMenuTabs />}
            </div>
        </>
    );
}

export default AppWrapper;

