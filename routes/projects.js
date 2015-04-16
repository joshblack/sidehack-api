import { Router } from 'express';
import sendResponse from '../lib/response';

const router = Router();

let privateFields = [
  'createdAt',
  'updatedAt',
  'inspect',
  'members',
  'id'
];

function removePrivateFields(record) {
  return Object.keys(record)
    .filter((field) => {
      return !privateFields.includes(field);
    })
    .reduce((o, k) => {
      return Object.assign(o, { [k]: record[k] });
    }, {})
}

router.get('/', (req, res) => {
  const { project: Project } = req.app.models;

  Project.find()
    .then((projects) => {
      sendResponse(res, 200, { projects: projects.map(removePrivateFields) });
    })
    .catch((err) => {
      sendResponse(res, 500, { message: 'Internal error occured.' });
    });
});

router.post('/', (req, res) => {
  const { project: Project } = req.app.models;

  Project.findOrCreate({ id: req.body.id }, req.body)
    .then((project) => sendResponse(res, 200, {
      id: project.id,
      message: 'Project created successfully.'
    }))
    .catch((err) => sendResponse(res, 500, {
      message: 'Error in creating project. Check to make sure the JSON is valid.'
    }));
});

export default router;
