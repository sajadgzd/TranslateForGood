import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Profile from "./components/pages/Profile";
import Navbar from './components/Navbar';

function App() {
    // Check for browser support of service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        // Successful registration
        console.log('[Service Worker] Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        // Failed registration, service worker won’t be installed
        console.log('[Service Worker] Registration failed, error:', err);
      });
    }
    
    let deferredPrompt;
    // control app installation  banner
    window.addEventListener('beforeinstallprompt', function(event) {
      console.log('beforeinstallprompt fired');
      event.preventDefault();
      Login.deferredPrompt = event;
      return false;
    });

    return (
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path='/home' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={About} />
          <Route exact path='/profile' component={Profile} />
        </Switch>
      </BrowserRouter>
    );
}

export default App;
