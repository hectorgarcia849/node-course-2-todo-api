const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done());
}); //ensures db is empty

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app) //request allows us to test asynchronous processes
            .post('/todos') //type of request
            .send({text}) //allows us to send data with a request
            .expect(200) //status expected, can really have anything in here, just checks if it is included in response
            .expect((res) => {
                expect(res.body.text).toBe(text); //checks if response includes the text we sent, b/c note in server.js we send the doc back as a response.
            })
            .end((err, res) => {
                //possible errors, if expect != 200 or if res.body.text not text
                if (err) {
                    return done(err);
                }
                Todo.find()
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
           .send({})
           .expect(400)
           .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
           });
    });
});
