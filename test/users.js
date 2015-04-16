import Waterline from 'waterline';
import User from '../models/User';
import Token from '../models/Token';
import Project from '../models/Project';
import config from '../config/test';

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import should from 'should';
import randomUser from './helpers/randomUser';
import router from '../routes';

const app = express();
app.use(bodyParser.json());
app.use('/api/v1', router);

const API = request(app);
let ORM;

before((done) => {
  ORM = new Waterline();

  ORM.loadCollection(User);
  ORM.loadCollection(Token);
  ORM.loadCollection(Project);

  ORM.initialize(config, (err, models) => {
    if (err) console.error(err);

    app.models = models.collections;
    app.connections = models.connections;

    done();
  });
});

describe('GET /api/v1/users', () => {
  const firstUser = randomUser(),
        secondUser = randomUser();

  before((done) => {
    const { user: User } = app.models;

    User.create([firstUser, secondUser])
      .then(() => done())
      .catch((err) => done(err));
  });

  it('should return a listing of application users', (done) => {
    API.get('/api/v1/users')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 200);
        res.body.should.have.property('users').with.lengthOf(2);

        done();
      });
  });

  after((done) => {
    const { user: User } = app.models;

    User.query('TRUNCATE TABLE users', done);
  });
});

// describe('POST /api/v1/users', () => {
//   const newUser = randomUser();

//   it('should create a new user given a valid JSON body', (done) => {
//     API.post('/api/v1/users')
//       .send(newUser)
//       .end((err, res) => {
//         should.not.exist(err);
//         res.should.have.property('status', 200);

//         const { message, id } = res.body;
//         message.should.be.exactly('New User succesfully created.');
//         id.should.be.exactly(3);

//         done();
//       });
//   });

//   it('should return an error if the JSON sent is invalid for creating a user', (done) => {
//     API.post('/api/v1/users')
//       .send({ foo: 'bar' })
//       .end((err, res) => {
//         should.not.exist(err);
//         res.should.have.property('status', 500);

//         const { message } = res.body;
//         message.should.be.exactly(
//           'Server could not create user. Check the JSON payload that you submitted'
//         );

//         done();
//       });
//   });
// });

// describe('GET /api/v1/users/:id', () => {
//   it('should return a user', (done) => {
//     API.get('/api/v1/users/1')
//       .end((err, res) => {
//         should.not.exist(err);

//         //res.should.have.property('status', 200);
//         //res.should.have.property('user', jane_doe);

//         done();
//       });
//   });

//   it('should return an error if the client requests a nonexistent user', (done) => {
//     API.get('/api/v1/users/999')
//       .expect(400)
//       .expect({
//         status: 400,
//         message: 'Unsupported request for the given user. Either a user does'
//           + ' not exist with the given id or another error occured.'
//       })
//       .end((err) => {
//         if (err) return done(err);
//         done();
//       });
//   })
// });

// describe('PUT /api/v1/users/:id', () => {
//   before((done) => API.post('/api/v1/users').send(randomUser()).end(done));
//   after((done) => API.delete('/api/v1/users/4').end(done));

//   it('should update a user record', (done) => {
//     API.put('/api/v1/users/4')
//       .send(randomUser())
//       .end((err, res) => {
//         should.not.exist(err);
//         res.should.have.property('status', 200);

//         const { id, message } = res.body;

//         message.should.be.an.instanceOf(String);
//         message.should.be.exactly('User succesfully updated.');
//         done();
//       });
//   });
// });

// describe('DELETE /api/v1/users/:id', () => {
//   before((done) => {
//     API.post('/api/v1/users')
//       .send(randomUser())
//       .end((err) => {
//         if (err) return done(err);
//         done();
//       });
//   });

//   it('should delete the user from the database', (done) => {
//     API.delete('/api/v1/users/4')
//       .end((err, res) => {
//         should.not.exist(err);
//         res.should.have.property('status', 200);

//         const { message } = res.body;
//         message.should.be.exactly('User resource succesfully deleted.');

//         done();
//       });
//   });
// });

// describe('GET /api/v1/users/:id/picture', () => {
//   it('should return the user\'s picture', (done) => {
//     API.get('/api/v1/users/1/picture')
//       .expect(200)
//       .expect({
//         status: 200,
//         url: jane_doe['avatar_url']
//       })
//       .end((err) => {
//         if (err) return done(err);
//         done();
//       });
//   });

//   it('should return an error if an improper access occurs', (done) => {
//     API.get('/api/v1/users/999/picture')
//       .expect(400)
//       .expect({
//         status: 400,
//         message: "Unsupported request for the given user's picture. Either the"
//         + " id is incorrect or another issue occured."
//       })
//       .end((err) => {
//         if (err) return done(err);
//         done();
//       });
//   });
// });

// describe('GET /api/v1/projects', () => {
//   const newProject1 = randomProject(),
//         newProject2 = randomProject();

//   before((done) => {
//     API.post('/api/v1/projects')
//       .send(newProject1)
//       .end(() => API.post('/api/v1/projects').send(newProject2).end(done));
//   });

//   it('should return a listing of all the projects in the database', (done) => {
//     API.get('/api/v1/projects')
//       .expect(200)
//       .expect({
//         status: 200,
//         projects: [newProject1, newProject2]
//       })
//       .end(done);
//   });

//   after((done) => {
//     const { project: Project } = app.models;

//     Project.query('TRUNCATE TABLE projects', (err) => {
//       if (err) console.error(err);
//       done();
//     });
//   });
// });

// describe('POST /api/v1/projects', () => {
//   const newProject = randomProject();

//   it('should create a new project', (done) => {
//     API.post('/api/v1/projects')
//       .send(newProject)
//       .expect(200)
//       .expect({
//         status: 200,
//         id: 1,
//         message: 'Project created successfully.'
//       })
//       .end(done);
//   });

//   it('should return an error with an invalid project', (done) => {
//     API.post('/api/v1/projects')
//       .send({ foo: 'bar' })
//       .expect(500)
//       .expect({
//         status: 500,
//         message: 'Error in creating project. Check to make sure the JSON is valid.'
//       })
//       .end(done);
//   });
// });

// describe('GET /api/v1/projects/:id', () => {

// });

// describe('PUT /api/v1/projects/:id', () => {

// });

// describe('DELETE /api/v1/projects/:id', () => {

// });

after((done) => ORM.teardown(done));
