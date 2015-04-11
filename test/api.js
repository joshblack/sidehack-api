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
});
