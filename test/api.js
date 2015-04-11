import expect from 'expect.js';
import request from 'supertest';

const fetch = request('http://localhost:8000');

describe('GET /api/v1', () => {
  it('should return a valid status code', (done) => {
    fetch.get('/api/v1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      })
  });

  it('should return information about the current API version', (done) => {
    fetch.get('/api/v1')
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
    fetch.get('/api/v1/this/does/not/exist')
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
    fetch.post('/api/v1/this/does/not/exist')
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
    fetch.put('/api/v1/this/does/not/exist')
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
    fetch.patch('/api/v1/this/does/not/exist')
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
    fetch.delete('/api/v1/this/does/not/exist')
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
