import React from 'react';
import './Cards.css';
import CardItem from './CardItem';


function Cards() {
  return (
      
    <div className='cards'>
        <h1>How it works?</h1>
        <p className='about' id='how_it_works'>TranslateForGood is a free platform connecting users needing a translation with multilingual volunteers. Are you a tourist visiting a foreign country, an immigrant uprooting your family to start a new life, or a refugee crossing national boundaries? Whether you are having trouble understanding a label on a food product or struggling writing a professional email, our application will help you. With our platform you can upload different types of files needing a translation and we will match them with volunteer translators in real time.</p>
        
        <h1>How are we different?</h1>
        <p className='about' >There are many tools available online providing translation
services. While human-based applications provide
quick and convenient translations, they often lack accuracy,
real-human connection, and cultural knowledge. Human-based translation services, on the other hand, while
accurate and reliable are often costly. Moreover, most of
such services are primarily used for translations of official
documents and not in situations of a daily life. They are
expensive, slow, and not available around the clock. TranslateForGood is free human-based service, available 24/7, and aimed to help in any situation. </p>
        <h1 id='contact_us'>Connect with us: </h1>
        <p className='about' > This is a Capstone project for computer science students at the City College of New York. Our team consists of four great developers, and each of us is bilingual. We all came to the US from different countries and we know how challenging language barrier can be. That is why we decided to create TranslateForGood.</p>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/ekaterina.jpg'
              text='Ekaterina Arslanbaeva'
              path='https://www.linkedin.com/in/ekaterina-arslanbaeva-022070160?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_people%3BtPWTLeCdQjCBWK0zr%2FepZQ%3D%3D'
            />
            <CardItem
              src='images/sajad.png'
              text='Sajad Gholamzadehrizi'
              path='https://www.linkedin.com/in/sajadgzd?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_people%3BFfTtSNleROiRpXkb5W%2Fl8Q%3D%3D'
            />
            <CardItem
              src='images/natalia.jpeg'
              text='Natalia Harrow'
              path='https://www.linkedin.com/in/nataliaharrow?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_people%3BBFTLy2SlTT%2BX9sBvrP%2FOCg%3D%3D'
            />
            <CardItem
              src='images/marina.jfif'
              text='Marina Orzechowski'
              path='https://www.linkedin.com/in/marina-skachko-orzechowski/'
            />
          </ul>
          
        </div>
      </div>
    </div>
  );
}

export default Cards;
