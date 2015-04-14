import Waterline from 'waterline';
import User from '../models/User';
import Token from '../models/Token';
import Project from '../models/Project';
import config from '../config/test';

import request from 'supertest';
import express from 'express';
import Faker from 'faker';
import router from '../routes';

const jane_doe = {
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

const john_doe = {
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

const users = [jane_doe, john_doe];

const app = express();
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
    API.get('/api/v1/users/3')
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
    API.get('/api/v1/users/3/picture')
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
