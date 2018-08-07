import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuAppBar from '../navbar/navbar';
import axios from 'axios';


import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

class TaskView extends Component {

    fetchTasks(event) {
		console.log("inside click even")
		var apiBaseUrl = "http://localhost:8000/";
		var self = this;
		const params = new URLSearchParams();
		params.append('owner', this.state.user);
		axios({
			url: apiBaseUrl + 'fetch/owner/' + this.state.user,
			method: 'get'
		}).then((response) => {
			console.log(response);
		}).catch((error) => {
			console.log(error);
		});
	}

    constructor(props) {
        super(props);
        console.log(props);
		this.state = {
            tasks: "",
            user: JSON.parse(localStorage.username)
        }
        this.fetchTasks();
    }
    
    render() {
        
        return (
            <div>
                 <div>
                    <MuiThemeProvider >
                        <div>
                            <MenuAppBar
                                title="Task Trackr"
                            />
                            <div class="main_task_view"> 
                                
                            </div>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }
}

export default TaskView;