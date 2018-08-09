import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Paper } from '@material-ui/core';


class Home extends Component {
	handleRegister() {
		this.setState({
			redirectToRegister: true
		});
	}
	handleClick(event) {
		console.log("inside click even")
		var apiBaseUrl = "http://localhost:8000/";
		const params = new URLSearchParams();
		params.append('username', this.state.username);
		params.append('password', this.state.password);
		axios({
			url: apiBaseUrl + 'user/auth',
			data: params,
			method: 'post'
		}).then((response) => {
			console.log("login set user")
			localStorage.setItem('username', JSON.stringify(this.state.username));
			console.log(localStorage.username);
			this.setState({
				redirect: true
			});
			
		}).catch((error) => {
			console.log(error);
			this.setState({
				loginFail: true
			});
		});
	}
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			loginFail: false,
			redirect: false,
			redirectToRegister: false
		}
	}

	render() {
		const loginFail = this.state.loginFail;
		const redirect = this.state.redirect;
		const redirectToRegister = this.state.redirectToRegister;

		let message = "";
		if (loginFail) {
			message = "Login failed. Please check your username or password and try again."
		}
		if (redirect) {
			return <Redirect to="/tasks" />;
		}
		if (redirectToRegister) {
			return <Redirect to="/register" />;
		}
		return (
			<Paper>
			<div>
				<AppBar
					title="Login"
				/>
				<TextField
					hintText="Enter your Username"
					floatingLabelText="Username"
					onChange={(event, newValue) => this.setState({ username: newValue })}
				/>
				<br />
				<p style={failStyle} > {message} </p>
				<TextField
					type="password"
					hintText="Enter your Password"
					floatingLabelText="Password"
					onChange={(event, newValue) => this.setState({ password: newValue })}
				/>
				<br />
				< RaisedButton label="Register Account" variant="outlined" style={style} onClick={(event) => this.handleRegister(event)} />
				< RaisedButton label="LOGIN" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
			</div>
			</Paper>
		);
	}
}
const style = {
	margin: 15,
};
const failStyle = {
	color: "red",

};
export default Home;