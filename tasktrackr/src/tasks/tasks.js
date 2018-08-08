import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import axios from 'axios';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from '@material-ui/core/styles';
import "../tasks/task.css";
import { lightBlue } from '@material-ui/core/colors/purple';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select } from '@material-ui/core';
const header = createMuiTheme({
    palette: {
        primary: lightBlue
    },
});
const styles = theme => ({
    root: {
        width: 'auto',
        margin: '20%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    critical: {
        backgroundColor: '#f6685e'
    },
    high: {
        backgroundColor: '#f6685e'
    },
    medium: {
        backgroundColor: '#f6685e'
    },
    low: {
        backgroundColor: '#f6685e'
    },
    button: {
        margin: theme.spacing.unit,
    },
    column: {
        flexBasis: '33.33%',
    }
});
const apiBaseUrl = "http://localhost:8000/";
var taskUrl = apiBaseUrl + "task";

class TaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            user: JSON.parse(localStorage.username),
            dialog_open: false,
            dialog_priority_field: 0,
            dialog_name_field: "",
            dialog_descrip_field: "",
            dialog_date_field: null
        }
        this.fetchTasks();
    }
    handleClick() {
        this.setState({ dialog_open: true });
    };
    handleClose = (e) => {
        this.setState({ dialog_open: false });
    };
    handleSubmit = (e) => {
        var nameVal = document.getElementById("name").value;
        var descripVal = document.getElementById("descrip").value;
        var dateVal = document.getElementById("due_date").value;
        const params = new URLSearchParams();
        params.append('name', nameVal);
        params.append('descrip', descripVal);
        params.append('due_date', dateVal);
        params.append('owner', JSON.parse(localStorage.username));
        params.append('priority', "critical");
		axios({
			url: taskUrl,
			data: params,
			method: 'post'
		}).then((response) => {
			console.log(response);
		}).catch((error) => {
			console.log(error);
		});
        this.handleClose();
    }
    handlePrioritySelection = (event, index, value) => {
        this.setState({
            dialog_priority_field: { value }
        });
    };
    buildDataMap() {
        const tasks = this.state.tasks;
        const taskList = tasks.map(function (task, index) {
            let style = task.priority + "Tasks";
            return (
                <div key={task._id} className={style}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography color="primary">{task.name}</Typography>
                            <div className="date">
                                <Typography align='right'>Target Date: {task.due_date} </Typography>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className={styles.column} />
                            <div className={styles.column} >
                                <Typography>
                                    {task.descrip}
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <br />
                </div>
            );
        });
        return (<div>{taskList}</div>);
    }

    fetchTasks(event) {
        const params = new URLSearchParams();
        params.append('owner', this.state.user);
        axios({
            url: apiBaseUrl + 'fetch/owner/' + this.state.user,
            method: 'get'
        }).then((response) => {
            this.setState({
                tasks: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <MuiThemeProvider theme={header}>
                <div className={styles.root}>
                    <AppBar
                        title="Task Trackr"
                    />
                    <br />
                    <div className="taskBody">
                        {this.buildDataMap()}
                    </div>
                    <br />
                    <Button onClick={(event) => this.handleClick(event)} variant="contained" color="primary">
                        Add New Task
                    </Button>
                    <Dialog
                        open={this.state.dialog_open}
                        onClose={this.handleClose}>
                        <DialogTitle id="form-dialog-title"> Add Task </DialogTitle>

                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                defaultValue={this.state.dialog_name_field}
                                label="Task Name"
                                type="text"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField

                                margin="dense"
                                id="descrip"
                                label="Description"
                                defaultValue={this.state.dialog_descrip_field}
                                type="text"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id="due_date"
                                label="Target Date"
                                type="date"
                                defaultValue={this.state.dialog_date_field}
                                margin="dense"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                                </Button>
                            <Button onClick={this.handleSubmit} color="primary">
                                Add
                                </Button>
                        </DialogActions>

                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}
export default TaskView;