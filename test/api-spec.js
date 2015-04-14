import request from 'supertest';
import express from 'express';
import router from '../routes';

const app = express();
app.use('/api/v1', router);

const API = request(app);

describe('GET /api/v1', () => {
  it('should return information about the current API version', (done) => {
    API.get('/api/v1')
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
    API.get('/api/v1/this/does/not/exist')
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
    API.post('/api/v1/this/does/not/exist')
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
    API.put('/api/v1/this/does/not/exist')
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
    API.patch('/api/v1/this/does/not/exist')
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
    API.delete('/api/v1/this/does/not/exist')
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
