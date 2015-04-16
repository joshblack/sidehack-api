import Waterline from 'waterline';
import User from '../models/User';
import Token from '../models/Token';
import Project from '../models/Project';
import config from '../config/test';

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import should from 'should';
import randomProject from './helpers/randomProject';
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

describe('GET /api/v1/projects', () => {
  const newProject1 = randomProject(),
        newProject2 = randomProject();

  before((done) => {
    const { project: Project } = app.models;

    Project.create([newProject1, newProject2]).then(done).catch(done);
  });

  it('should return a listing of all projects', (done) => {
    API.get('/api/v1/projects')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.property('status', 200);
        res.body.should.have.property('projects').with.lengthOf(2);
        done();
      });
  });

  after((done) => {
    const { project: Project } = app.models;

    Project.query('TRUNCATE TABLE projects', done);
  });
});

after((done) => ORM.teardown(done));
