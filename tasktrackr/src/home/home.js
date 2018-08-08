import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


class Home extends Component {
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
			this.setState({
				redirect: true
			});
			localStorage.setItem('username', JSON.stringify(this.state.username));
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
			redirect: false
		}
	}

	render() {
		const loginFail = this.state.loginFail;
		const redirect = this.state.redirect;

		let message = "";
		if (loginFail) {
			message = "Login failed. Please check your username or password and try again."
		}
		if (redirect) {
			return <Redirect to="/tasks" />;
		}
		return (
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
				< RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
			</div>
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