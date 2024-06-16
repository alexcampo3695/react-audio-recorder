import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import '../styles/mobile-nav.scss';

const TabsTest: React.FunctionComponent = () => (
  <div className="navbar-ios">
    <li className="list-item-ios">
      <i className="fas fa-home"></i>
      <span className="list-item-name-ios">Home</span>
    </li>
    <li className="list-item-ios">
      <i className="fas fa-list"></i>
      <span className="list-item-name-ios">Recordings</span>
    </li>
    <li className="list-item-ios">
      <i className="fas fa-user"></i>
      <span className="list-item-name-ios">Settings</span>
    </li>
  </div>
);

export default TabsTest;