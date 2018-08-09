import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import "../tasks/task.css";
import { lightBlue } from '@material-ui/core/colors/purple';
import FormGroup from '@material-ui/core/FormGroup';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, Toolbar, IconButton, MenuItem, Switch, FormControlLabel, Paper, Card, CardContent } from '@material-ui/core';
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
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    flex: {
        flexGrow: 1,
    },
    card: {
        maxWidth: 275,
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    button: {
        margin: theme.spacing.unit,
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
            dialog_date_field: null,
            auth: true,
            changeMade: ""
        }
        this.fetchTasks();
    }
    handleClick() {
        this.setState({ dialog_open: true });
    };
    handleClose = (e) => {
        this.setState({ dialog_open: false });
    };
    handleLogout = (e) => {
        localStorage.setItem("username", "");
        this.setState({
            auth: false
        })
    }

    handleEdit = (e) => {
        console.log(e);
    }

    handleSubmit = (e) => {
        var nameVal = document.getElementById("name").value;
        var descripVal = document.getElementById("descrip").value;
        var dateVal = document.getElementById("due_date").value;
        const params = new URLSearchParams();
        params.append('name', nameVal);
        params.append('descrip', descripVal);
        params.append('due_date', dateVal);
        params.append('owner', this.state.user);
        params.append('priority', "");
        axios({
            url: taskUrl,
            data: params,
            method: 'post'
        }).then((response) => {
            this.fetchTasks();
        }).catch((error) => {
            this.fetchTasks();
        });
        this.handleClose();
    }
    handlePrioritySelection = (event, index, value) => {
        this.setState({
            dialog_priority_field: { value }
        });
    };
    buildDataMap = (e) => {
        const tasks = this.state.tasks;
        const taskList = tasks.map(function (task, index) {
            let style = task.priority + "Tasks tasks";
            
            return (
                <div key={task._id} className={style}>
                    <Card className={styles.card}>
                        <CardContent>
                            <div >
                                <Typography variant="headline" color="primary">{task.name}</Typography>
                            </div>
                            <div >
                                <Button color="primary" aria-label="Edit" className="edit-button">
                                    Archive
                                </Button>
                            </div>
                            <div>
                                <Typography variant="body2" className={styles.descrip}>
                                    {task.descrip}
                                </Typography>
                                <br />
                                <div >
                                    <Typography gutterBottom noWrap>
                                        {task.due_date}
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
        const redirect = this.state.auth;
        if (!redirect) {
            return (<Redirect to="/" />);
        }
        return (
            <MuiThemeProvider theme={header}>
                <Paper className="paper">
                    <div className={styles.root}>
                        <AppBar title="Tasks" position="static">
                            <Toolbar>
                                <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
                                    <MenuItem />
                                </IconButton>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={this.state.auth} onChange={this.handleLogout} aria-label="LoginSwitch" />
                                        }
                                        label={this.state.auth ? 'Logout' : 'Login'}
                                    />
                                </FormGroup>
                            </Toolbar>
                        </AppBar>
                        <br />
                        <div className="taskBody">
                            {this.buildDataMap()}
                        </div>
                        <br />
                        <Button onClick={(event) => this.handleClick(event)} variant="contained" color="primary">
                            Add New Task
                        </Button>
                        <br />
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
                </Paper>
            </MuiThemeProvider>
        );
    }
}
export default TaskView;