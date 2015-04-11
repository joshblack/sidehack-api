import expect from 'expect.js';
import request from 'supertest';

const API = request('http://localhost:8000/api/v1');

describe('GET /users', () => {
  it('should provide information about the endpoint', (done) => {
    API.get('/users')
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

describe('GET /users/:id/picture', () => {
  it('should return the user\'s picture', (done) => {
    API.get('/users/2/picture')
      .expect(200)
      .expect({
        status: 200,
        url: 'https://avatars.githubusercontent.com/u/3901764?v=3'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return an error if an improper access occurs', (done) => {
    API.get('/users/3/picture')
      .expect(400)
      .expect({
        status: 400,
        message: "Unsupported request for the given user's picture. Either the"
        + " id is incorrect or another issue occured."
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  })
});

