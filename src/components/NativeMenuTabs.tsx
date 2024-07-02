import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../styles/mobile-nav.scss';

const NativeMenuTabs: React.FunctionComponent = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="navbar-ios">
      <li className="list-item-ios">
        <NavLink to="/home" className={isActive('/home') ? 'active' : ''}>
          <div className="icon">
            <i
              className="fas fa-home"
              style={{ color: isActive('/home') ? '#26619B' : '#cecece'}}
            ></i>
          </div>
        </NavLink>
      </li>
      <li className="list-item-ios">
        <NavLink to="/table" className={isActive('/table') ? 'active' : ''}>
          <div className="icon">
            <i
              className="fas fa-clipboard-list"
              style={isActive('/table') ? { color: '#26619B' } : { color: '#cecece' }}
            ></i>
          </div>
        </NavLink>
      </li>
      <li className="list-item-ios">
        <NavLink to="/profile_settings" className={isActive('/profile_settings') ? 'active' : ''}>
          <div className="icon">
            <i
              className="fas fa-cog"
              style={isActive('/profile_settings') ? { color: '#26619B' } : { color: '#cecece' }}
            ></i>
          </div>
        </NavLink>
      </li>
    </div>
  );
};

export default NativeMenuTabs;
