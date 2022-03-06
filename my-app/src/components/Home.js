import React from 'react';
import logo from "../images/logo.jpg";
import '../styles/Home.css';
import {Link} from 'react-router-dom';

class Home extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className='navbar'>
                    <img src={logo} alt='logo'></img>
                    <div className='navbar-buttons'>
                        <Link to={'/login'}><button>Log In</button></Link>
                        <Link to={'/signup'}><button>Sign Up</button></Link>
                    </div>
                </div>
                <div className='home-content'>
                    <div className='home-content-text'>
                        <h1>Find Your Own Personal Recipe From a Vast Library</h1>
                        <p>A website library with different recipes curated for you shared by other users</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Home;