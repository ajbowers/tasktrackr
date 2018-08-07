var ObjectID = require('mongodb').ObjectID;
var passwordHash = require('password-hash');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');



module.exports = function (app, db) {
    app.use(cors());
    const collection =
    /*  
     API for user creation and user auth
    */
    app.post('/user', (req, res) => {
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash.generate(req.body.password)
        };
        var user_exists = null;
        db.collection('users').find({
            //username as sole unqiue identifier
            username: req.body.username 
        }).toArray(function (err, result) {
            if (result.length == 0) { 
                db.collection('users').insert(user, (err, result) => {
                    if (err) {
                        res.send({
                            'error': 'An error has occured'
                        });
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            } else { 
                res.send({
                    'error': 'Account with this username already exists. Please use another name'
                });
            }
        }); 
    });

    /**
     *  Checks if user has an account, and authorizes it with input password vs hashed pass in db
     */
    app.post('/user/auth', (req, res) => {
        console.log(req.body.username);
        db.collection('users').find({
            // username exists as sole unique id and is used for auth along with hashed password
            username: req.body.username
        }).toArray(function (err, result) {
            console.log(req.body);
            if (err) {
                res.send({
                    'error': 'error happened bro'
                });
            } else if (result[0] != null) {
                if (passwordHash.verify(req.body.password, result[0].password)) {
                    res.status(200)
                    res.send(result[0]);
                } else {
                    res.status(401);
                    res.send({
                        'error': "username or password do not match"
                    });
                }
            } else {
                res.status(401);
                res.send({
                    'error': "username or password do not match"
                });
            }
        });
    });
    /*******************************************************************************************/
    /**
     *  API related to exposing task logic
     */
    // Create a New task  
    app.post('/task', (req, res) => {
        const task = {
            name: req.body.name,
            descrip: req.body.descrip,
            priority: req.body.priority,
            due_date: req.body.due_date,
            owner: req.body.owner,
            status: req.body.status
        };
        db.collection('tasks').insert(task, (err, result) => {
            if (err) {
                res.send({
                    'error': 'An error has occured'
                });
            } else {
                res.send(result.ops[0]);
            }
        });
        res.send('create')
    });

    // Fetch existing tasks by task ID
    app.get('/fetch/:id', (req, res) => {
        const id = req.params.id;
        const task = {
            '_id': new ObjectID(id)
        };
        db.collection('tasks').findOne({})(task, (err, item) => {
            if (err) {
                res.send({
                    'error': 'Object with this ID not found'
                });
            } else {
                res.send(item);
            }
        });
    });

    // Fetch existing tasks by Owner
    app.get('/fetch/owner/:owner', (req, res) => {
        const owner_name = req.params.owner;
        console.log(owner_name);
        db.collection('tasks').find({
            owner: {
                $eq: owner_name
            }
        }).toArray(function (err, result) {
            if (err) {
                res.send({
                    'error': 'error happened bro'
                });
            } else {
                console.log(result)
                res.send(result);
            }
        });
    });

    // Fetch all tasks
    app.get('/fetch', (req, res) => {
        db.collection('tasks').find({}).toArray(function (err, result) {
            if (err) {
                res.send({
                    'error': 'error happened bro'
                });
            } else {
                res.send(result);
            }
        });
    });

    // Update record by ID
    app.post('/task/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const task = {
            name: req.body.name,
            descrip: req.body.descrip,
            priority: req.body.priority,
            due_date: req.body.due_date,
            owner: req.body.owner,
            status: req.body.status
        };
        db.collection('tasks').update(details, task, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(task);
            }
        });
    });
};