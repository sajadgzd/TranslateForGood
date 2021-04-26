import React, { useEffect, useState } from "react";
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
import Chatroom from './components/pages/Chatroom';

import io from "socket.io-client"

function App() {

  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("token");
    if(token != null && !socket) {
      const newSocket = io("http://localhost:5000", {
          query: {
              token: localStorage.getItem("token"),
          },
          transport : ['websocket']
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
      });

      setSocket(newSocket);
    }
  }

  // set the socket whenever the App component loads
  useEffect(() => {
    setupSocket();
  }, []);

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
          <Route exact path='/chatroom' component={Chatroom} />
          <Route exact path='/chat/:id' component={Chat} />
        </Switch>
      </BrowserRouter>
    );
}

export default App;
