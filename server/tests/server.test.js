const expect = require('expect'); //this is now jest
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app) //request allows us to test asynchronous processes
            .post('/todos') //type of request
            .set('x-auth', users[0].tokens[0].token)
            .send({text}) //allows us to send data with a request
            .expect(200) //status expected, can really have anything in here, just checks if it is included in response
            .expect((res) => {
                expect(res.body.text).toBe(text); //checks if response includes the text we sent, since in server.js we send the doc back as a response.
            })
            .end((err, res) => {
                //possible errors, if expect != 200 or if res.body.text not text
                if (err) {
                    return done(err);
                }
                Todo.find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();//returns a pointer to the Todo collection
                    }).catch((err) => done(err));
            });
    });

    it('should not create todo with invalid body data', (done) => {
       request(app)
           .post('/todos')
           .set('x-auth', users[0].tokens[0].token)
           .send({})
           .expect(400)
           .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
           });
    });
});

describe('GET /todos', ()=> {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done); //not asynchronous
    });
});

describe('Get /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo is invalid', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString().concat('111')}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should not return a todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                //check if deletion occured

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should not remove a todo that belongs to another user', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err){
                    res.expect(404);
                    return done(err);
                }

                //check that deletion did not happen

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if objectID is invalid', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString().concat('111')}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo', (done) => {
        //grab id of first item
        var id = todos[0]._id.toHexString();
        var text = "New text data";

        //update text, set completed true
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => { //check for changes in the response
                expect(res.body.todo.text).toEqual(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt === 'number').toBe(true);
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = "New text data";

        //update todo, update text and set completed to false
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({completed: false, text})
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                //in the response we check for the changes: text is changed, completed is false, completedAt is null
                expect(res.body.todo.text).toEqual(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
                done();
            });

    });

    it('should not allow update of todo by other user', (done) => {
        //grab id of first item
        var id = todos[0]._id.toHexString();
        var text = "New text data";

        //update text, set completed true
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed: true, completedAt: new Date().getTime()})
            .expect(404)
            .end(done);
    });


});


//USER route tests

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({}); //expect an empty body because non-authenticated user
            })
            .end(done);

    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBeTruthy();
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => {done(e)});
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = "invalidemail";
        var password = "12345";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        //tries to create user that exists in db (see populateUsers)
        var email = users[0].email;
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end(done);
    });
});


describe('POST /users/login', () => {

    it('should login user and return auth token', done => {
       request(app)
           .post('/users/login')
           .send({
               email: users[1].email,
               password: users[1].password
           })
           .expect(200)
           .expect((res)=> {
                expect(res.headers['x-auth']).toBeTruthy();
           })
           .end((err, res) => {
                if(err){
                    return done(err);
                }

                //in this case, we are checking the user that doesn't have a token, so it will generate a new token on login and it will be the first element in the tokens array
               //if we had tested user[0] then we would have to check the second item in the tokens array
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1].access).toBe('auth');
                    expect(user.tokens[1].token).toBe(res.header['x-auth']);
                    done();
                }).catch((e) => {
                    done(e);
                });
           })
    });

    it('should reject invalid login', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: "invalidPassword"
            })
            .expect(400)
            .expect((res) => {expect(res.header['x-auth']).not.toBeTruthy()})
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err) => {
                if(err){
                   return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                   expect(user.tokens.length).toBe(0);
                   done();
                }).catch((e) => {done(e)});
            });

    });
});




