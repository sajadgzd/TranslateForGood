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
import Chat from './components/pages/Chat';

function App() {
  // register serviceWorker
  if('serviceWorker' in navigator){
    navigator.serviceWorker
      .register('/sw.js')
      .then(function(){
        console.log('SW registered.');
      });
  };

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
          <Route exact path='/chat' component={Chat} />
        </Switch>
      </BrowserRouter>
    );
}

export default App;
