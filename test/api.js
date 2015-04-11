import expect from 'expect.js';
import request from 'supertest';

const API = request('http://localhost:8000/api/v1');

describe('GET /', () => {
  it('should return a valid status code', (done) => {
    API.get('/')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      })
  });

  it('should return information about the current API version', (done) => {
    API.get('/')
      .expect({
        version: 'v1',
        description: 'Sidehack API Version 1.0'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      })
  });

  it('should catch nonexistent GET requests', (done) => {
    API.get('/this/does/not/exist')
      .expect(404)
      .expect({
        status: 404,
        message: 'GET request for this route is not supported'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should catch nonexistent POST requests', (done) => {
    API.post('/this/does/not/exist')
      .expect(404)
      .expect({
        status: 404,
        message: 'POST request for this route is not supported'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should catch nonexistent PUT requests', (done) => {
    API.put('/this/does/not/exist')
      .expect({
        status: 404,
        message: 'PUT request for this route is not supported'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should catch nonexistent PATCH requests', (done) => {
    API.patch('/this/does/not/exist')
      .expect({
        status: 404,
        message: 'PATCH request for this route is not supported'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it('should catch nonexistent DELETE requests', (done) => {
    API.delete('/this/does/not/exist')
      .expect({
        status: 404,
        message: 'DELETE request for this route is not supported'
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
