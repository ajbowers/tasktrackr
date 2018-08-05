var ObjectID     = require('mongodb').ObjectID;
var passwordHash = require('password-hash');


module.exports = function(app, db) {
    const collection = 
    // Create a New task 
    app.post('/user', (req, res) => {
        console.log(req.body);
      const user = { 
        first_name: req.body.first_name,
        last_name: req.body.last_name,  
        email: req.body.email,
        username: req.body.username,
        password: passwordHash.generate(req.body.priority)
      };
      db.collection('users').insert(user, (err, result) =>{
        if (err) {
            res.send({
                'error': 'An error has occured'
            });
        } else {
            res.send(result.ops[0]);
        }
      });
    });

    app.get('/user/auth', (req, res) => {
        const id = req.body.id;
        const user = { 
            '_id': new ObjectID(id)
        };
        db.collection('tasks').findOne(task, (err, item) => {
            if (err) {
                res.send({
                    'error':'Object with this ID not found'
                });
            } else { 
                res.send(item);
            }
        });
    });
  };