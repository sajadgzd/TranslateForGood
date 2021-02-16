import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
        <div className='footer-link-wrapper'>

          <div className='footer-link-items'>
            <h2>How it works</h2>
            <Link to='/'>About the app</Link>
            <Link to='/'>Reviews</Link>
            <Link to='/'>Frequently Asked Questions</Link>
            <Link to='/'>Limitations</Link>
            
          </div>
          <div className='footer-link-items'>
            <h2>Our team</h2>
            <Link to='/sign-up'>About our team</Link>
            <Link to='/sign-up'>Contact us</Link>
          </div>
        </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/login' className='social-logo'>
            TranslateForGood
              <i className='fas fa-hand-holding-heart' />
            </Link>
          </div>
          <small className='website-rights'>TranslateForGood © 2021</small>
          <div className='social-icons'>            
            <Link
              className='social-icon-link twitter'
              to='/login'
              target='_blank'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </Link>
            <Link
              className='social-icon-link twitter'
              to='/login'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
