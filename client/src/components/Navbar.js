import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click); // used for menu icon (reverse style)
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  // solves problem of signin bttn to show in MobileMenu on refresh
  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>

          {/* On navbar  (left) add logo as a link which leads to Home page*/}
          <Link to='/about' className='navbar-logo' onClick={closeMobileMenu}>
            TranslateForGood
            <i className="fas fa-hand-holding-heart"></i>
          </Link>

          {/* On navbar  (right) add menu icon, which only opens if window is too narrow to show tabs (MobileMenu)*/}
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
            {/* Hide the menu if something was selected on it*/}
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'> 
              <Link to='/about' className='nav-links' onClick={closeMobileMenu}> 
                About
              </Link>
            </li>

            <li>
              <Link
                to='/Login'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>Login</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
