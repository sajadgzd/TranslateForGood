import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import GitHubIcon from '@material-ui/icons/GitHub';

function Footer() {
  return (
    <div className='footer-container' style={{marginTop: "100px"}}>
        <div className='' style={{textAlign: "center", color: "white"}}>
        
          {/* <div className='footer-link-items'> */}
            <h5 style={{marginBottom: "20px", color: "white", textAlign: "center"}}>Developers <GitHubIcon></GitHubIcon></h5>
            <a href='https://github.com/EkaterinaArslanbaeva' style={{color: "white"}}>Ekaterina Arslanbaeva</a> <span> |  </span>
            <a href='https://github.com/sajadgzd' style={{color: "white"}}>Sajad Gholamzadehrizi</a> <span> |  </span>
            <a href='https://github.com/nataliaharrow' style={{color: "white"}}>Natalia Harrow</a> <span> |  </span>
            <a href='https://github.com/MarinaOrzechowski' style={{color: "white"}}>Marina Orzechowski</a>
          {/* </div> */}

          <section className='' style={{marginTop: "20px", textAlign: "center"}}>
            <div className='' style={{textAlign: "center"}}>
            <small className='' style={{textAlign: "center"}}>TranslateForGood © 2021</small>
          
            </div>
          </section>
        </div>

    </div>
  );
}

export default Footer;
