import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/mobile-nav.scss';
import feather from "feather-icons";


const TabsTest: React.FunctionComponent = () => (
  <div className="navbar-ios">
    <li className="list-item-ios">
      <Link to="/home">
        <div className="icon">
            <i className="lnil lnil-home"></i>
        </div>
        {/* <span className="list-item-name-ios">Home</span> */}
      </Link>
    </li>
    <li className="list-item-ios">
      <Link to="/table">
      <div className="icon">
            <i className="lnil lnil-list"></i>
        </div>
        {/* <span className="list-item-name-ios">Recordings</span> */}
      </Link>
    </li>
    <li className="list-item-ios">
      <Link to="/profile_settings">
        <div className="icon">
            <i className="lnil lnil-user"></i>
        </div>
        {/* <span className="list-item-name-ios">Settings</span> */}
      </Link>
    </li>
  </div>
);

export default TabsTest;
