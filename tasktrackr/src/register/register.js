import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

class Register extends Component {
  handleSubmit= (e) => {
    console.log("handle success")
    this.setState({
      open: false,
      redirect: true
    })
  }
  handleClose = (e) => {
    this.setState({
      open: false
    });
  }

  handleRedirect = (e) => { 
    this.setState({
      redirect: true
    })
  }

  handleClick(event) {
    console.log("inside click even")
    var apiBaseUrl = "http://localhost:8000/";
    const params = new URLSearchParams();
    params.append('username', this.state.username);
    params.append('password', this.state.password);
    params.append('first_name', this.state.first_name);
    params.append('last_name', this.state.last_name);
    axios({
      url: apiBaseUrl + 'user',
      data: params,
      method: 'post'
    }).then((response) => {
      console.log(response.data.msg);
      if (response.data.msg !== "account_email_exists" ||
        response.data.msg !== "account_username_exists") {
        this.setState({
          open: true
        });
      } else {
        this.setState({
          errorType: response.data.msg
        });
      }
    }).catch((error) => {
      console.log(error.data);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      passwordRetype: '',
      requestFail: '',
      redirect: '',
      open: false
    }
  }
  render() {
    const errorType = this.state.errorType;
    const redirect = this.state.redirect;

    let message = "";
    if (errorType === "account_email_exists") {
      message = "Email is already in use.";
    } else if (errorType === "account_username_exists") {
      message = "Username is already in use";
    } else {

    }
    if (redirect) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Register"
            />
            <Paper>
              <TextField
                hintText="Enter your username"
                floatingLabelText="Username"
                required="true"
                onChange={(event, newValue) => this.setState({ username: newValue })}
              />
              <br />
              <TextField
                hintText="Enter your First Name"
                floatingLabelText="First Name"
                onChange={(event, newValue) => this.setState({ first_name: newValue })}
              />
              <br />
              <TextField
                hintText="Enter your Last Name"
                floatingLabelText="Last Name"
                onChange={(event, newValue) => this.setState({ last_name: newValue })}
              />
              <br />
              <TextField
                hintText="Enter your Email"
                type="email"
                required="true"
                floatingLabelText="Email"
                onChange={(event, newValue) => this.setState({ email: newValue })}
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                required="true"
                onChange={(event, newValue) => this.setState({ password: newValue })}
              />
              <br />
              <TextField
                type="password"
                hintText="Enter your Password again"
                floatingLabelText="Re-enter Password"
                required="true"
                onChange={(event, newValue) => this.setState({ passwordRetype: newValue })}
              />
              <br />
              <RaisedButton variant="outlined" label="Back"  onClick={(event) => this.handleRedirect(event)} />
              <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
            </Paper>
          </div>
        </MuiThemeProvider>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Registration Success"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Account registrastion successful! Return to login screen?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            <Button onClick={this.handleSubmit} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const style = {
  margin: 15,
};

export default Register;