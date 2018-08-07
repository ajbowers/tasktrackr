import React, { Component } from 'react';
import './App.css';
import Tasks from './tasks/tasks.js';
import Account from './account/account.js';
import Home from './home/home.js';
import Navbar from './navbar/navbar.js';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
      <div className="Body">
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/tasks" component={Tasks}/>
          <Route path="/account" component={Account} />
        </div>
      </div>
      </Router>
    );
  }
}

export default App;