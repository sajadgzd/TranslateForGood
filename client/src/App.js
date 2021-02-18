import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./Home";
import About from "./components/pages/About";
import Profile from "./components/pages/Profile";
import Navbar from './components/Navbar';

function App() {

    return (
      <BrowserRouter>
        <Navbar />
        <Switch>
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
