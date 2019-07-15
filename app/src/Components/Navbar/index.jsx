import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (((
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <a className="navbar-brand" href="https://www.zastrin.com" target="blank">Zastrin</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/Bank">Bank</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/listproposals">Proposals</Link>
                </li>
            </ul>
        </div>
    </nav>

)));

export default Navbar;