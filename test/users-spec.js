import Waterline from 'waterline';
import User from '../models/User';
import Token from '../models/Token';
import Project from '../models/Project';
import config from '../config/test';

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import Faker from 'faker';
import should from 'should';
import router from '../routes';

const jane_doe = randomUser();
const john_doe = randomUser();
const users = [jane_doe, john_doe];

const app = express();
app.use(bodyParser.json());
app.use('/api/v1', router);

const API = request(app);

before((done) => {
  const ORM = new Waterline();

  ORM.loadCollection(User);
  ORM.loadCollection(Token);
  ORM.loadCollection(Project);

  ORM.initialize(config, (err, models) => {
    if (err) console.log(err);

    app.models = models.collections;
    app.connections = models.connections;

    let { user: User } = models.collections;

    User.create(jane_doe)
      .then(() => {
        User.create(john_doe)
          .then(() => done())
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });
});

describe('GET /api/v1/users', () => {
  it('should return a listing of application users', (done) => {
    API.get('/api/v1/users')
      .expect(200)
      .expect({
        status: 200,
        users: [jane_doe, john_doe]
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /api/v1/users', () => {
  const new_user = {
    name: Faker.name.findName(),
    bio: Faker.lorem.paragraph(),
    email: Faker.internet.email(),
    provider: Faker.company.companyName(),
    provider_id: Faker.helpers.randomNumber(),
    avatar_url: Faker.image.imageUrl(),
    github_url: Faker.internet.domainName(),
    github_api_url: Faker.internet.domainName(),
    public_repos_count: Faker.helpers.randomNumber(),
    follower_count: Faker.helpers.randomNumber(),
    following_count: Faker.helpers.randomNumber()
  };

  it('should create a new user given a valid JSON body', (done) => {
    API.post('/api/v1/users')
      .send(new_user)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 200);

        const { message, id } = res.body;

        message.should.be.an.instanceOf(String);
        message.should.be.exactly('New User succesfully created.');
        id.should.be.an.instanceOf(Number);
        id.should.be.exactly(3);

        done();
      });
  });

  it('should return an error if the JSON sent is invalid for creating a user', (done) => {
    API.post('/api/v1/users')
      .send({ foo: 'bar' })
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 500);

        const { message } = res.body;

        message.should.be.an.instanceOf(String);
        message.should.be.exactly(
          'Server could not create user. Check the JSON payload that you submitted'
        );

        done();
      });
  });
});

describe('PUT /api/v1/users/:id', () => {
  before((done) => API.post('/api/v1/users').send(randomUser()).end(done));
  after((done) => API.delete('/api/v1/users/4').end(done));

  it('should update a user record', (done) => {
    API.put('/api/v1/users/4')
      .send(randomUser())
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 200);

        const { id, message } = res.body;

        message.should.be.an.instanceOf(String);
        message.should.be.exactly('User succesfully updated.');
        done();
      });
  });

  it('should suggest to use PATCH if only one property is included', (done) => {
    API.put('/api/v1/users/4')
      .send({ name: 'Josh Black' })
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 500);

        const { message } = res.body;

        message.should.be.an.instanceOf(String);
        message.should.be.exactly(
          'Only one property is being updated, please use PATCH instead'
        );
        done();
      })
  });
});

describe('DELETE /api/v1/users/:id', () => {
  before((done) => {
    API.post('/api/v1/users')
      .send(randomUser())
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should delete the user from the database', (done) => {
    API.delete('/api/v1/users/4')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 200);

        const { message } = res.body;
        message.should.be.exactly('User resource succesfully deleted.');

        done();
      });
  });
});

describe('GET /api/v1/users/info', () => {
  it('should provide information about the endpoint', (done) => {
    API.get('/api/v1/users/info')
      .expect(200)
      .expect({
        status: 200,
        message: 'User endpoint for the Sidehack API'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /api/v1/users/:id', () => {
  it('should return a user', (done) => {
    API.get('/api/v1/users/1')
      .expect(200)
      .expect({
        status: 200,
        user: jane_doe
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return an error if the client requests a nonexistent user', (done) => {
    API.get('/api/v1/users/999')
      .expect(400)
      .expect({
        status: 400,
        message: 'Unsupported request for the given user. Either a user does'
          + ' not exist with the given id or another error occured.'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  })
});

describe('GET /api/v1/users/:id/picture', () => {
  it('should return the user\'s picture', (done) => {
    API.get('/api/v1/users/1/picture')
      .expect(200)
      .expect({
        status: 200,
        url: jane_doe['avatar_url']
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return an error if an improper access occurs', (done) => {
    API.get('/api/v1/users/999/picture')
      .expect(400)
      .expect({
        status: 400,
        message: "Unsupported request for the given user's picture. Either the"
        + " id is incorrect or another issue occured."
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
})

after((done) => {
  const { user: User } = app.models;

  User.query('TRUNCATE TABLE users', (err) => {
    if (err) console.error(err);
    done();
  });
});

function randomUser() {
  return {
    name: Faker.name.findName(),
    bio: Faker.lorem.paragraph(),
    email: Faker.internet.email(),
    provider: Faker.company.companyName(),
    provider_id: Faker.helpers.randomNumber(),
    avatar_url: Faker.image.imageUrl(),
    github_url: Faker.internet.domainName(),
    github_api_url: Faker.internet.domainName(),
    public_repos_count: Faker.helpers.randomNumber(),
    follower_count: Faker.helpers.randomNumber(),
    following_count: Faker.helpers.randomNumber()
  };
}
