import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/mobile-nav.scss';

const TabsTest: React.FunctionComponent = () => (
  <div className="navbar-ios">
    <li className="list-item-ios">
      <Link to="/home">
        <i className="fas fa-home"></i>
        {/* <span className="list-item-name-ios">Home</span> */}
      </Link>
    </li>
    <li className="list-item-ios">
      <Link to="/table">
        <i className="fas fa-list"></i>
        {/* <span className="list-item-name-ios">Recordings</span> */}
      </Link>
    </li>
    <li className="list-item-ios">
      <Link to="/profile_settings">
        <i className="fas fa-user"></i>
        {/* <span className="list-item-name-ios">Settings</span> */}
      </Link>
    </li>
  </div>
);

export default TabsTest;
