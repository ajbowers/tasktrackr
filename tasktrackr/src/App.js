import React, { Component } from 'react';
import './App.css';
import Tasks from './tasks/tasks.js';
import Home from './home/home.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue } from '@material-ui/core/colors/purple';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
const header = createMuiTheme({
  palette: {
      primary: lightBlue
  },
});
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={header}>
      <Router>
      <div className="Body">
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/tasks" component={Tasks}/>
        </div>
      </div>
      </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;