import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Auth from "./Auth";
import Chat from "./Chat";
import Custom from "./Custom";
import Lobby from "./Lobby";
import Reconnect from "./Reconnect";
import Relay from "./Relay";
import State from "./State";
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <a href="https://github.com/colyseus/colyseus-examples"><img src="https://cdn.jsdelivr.net/gh/colyseus/colyseus@master/media/header.png" height="100" alt="colyseus" /></a>
      </header>

      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/chat">
              <Chat />
            </Route>
            <Route path="/auth">
              <Auth />
            </Route>
            <Route path="/state">
              <State />
            </Route>
            <Route path="/reconnect">
              <Reconnect />
            </Route>
            <Route path="/lobby">
              <Lobby />
            </Route>
            <Route path="/relay">
              <Relay />
            </Route>
            <Route path="/custom">
              <Custom />
            </Route>
            <Route path="/">
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/chat">chat</Link>
                  </li>
                  <li>
                    <Link to="/state">state</Link>
                  </li>
                  <li>
                    <Link to="/auth">auth</Link>
                  </li>
                  <li>
                    <Link to="/reconnect">reconnect</Link>
                  </li>
                  <li>
                    <Link to="/lobby">lobby</Link>
                  </li>
                  <li>
                    <Link to="/relay">relay</Link>
                  </li>
                  <li>
                    <Link to="/custom">custom</Link>
                  </li>
                </ul>
              </nav>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App