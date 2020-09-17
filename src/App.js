import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from 'react-redux'

import './App.css';
import Table from './components/Table/Table';
import Menu from './components/Menu/Menu';
import store from './store';

const uuidv4 = require('uuid/v4');                                // generating unique id function

export function Application() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header className="App-header">
            <ul className="nav navbar navnav">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
            </ul>
            <h1>Restaurant CRUD</h1>
            <p>Made by <a href="https://www.linkedin.com/in/endl/" className="App-link" target="blank">Podobailo Andriy</a></p>
            <br />
            <Route exact path="/">
              <Table
                idGenerator={uuidv4}
              />
            </Route>

            <Route path="/menu">
              <Menu
                idGenerator={uuidv4}
              />
            </Route>
          </header>
        </div>
      </Router>
    </Provider>
  );
}
