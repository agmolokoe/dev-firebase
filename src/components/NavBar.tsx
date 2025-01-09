import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/settings">Settings</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;	