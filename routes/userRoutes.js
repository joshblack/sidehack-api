import { Router } from 'express';
import sendResponse from '../lib/response';

const router = Router();

let privateFields = [
  'createdAt',
  'updatedAt',
  'token',
  'projects',
  'inspect',
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
  const { user: User } = req.app.models;

  User.find()
    .then((records) => {
      let users = records.map(removePrivateFields);

      sendResponse(res, 200, { users });
    })
    .catch((err) => {
      sendResponse(res, 500, {
        message: 'Internal server error. Request could not be fulfilled.'
      });
    });
});

router.get('/info', (req, res) => {
  sendResponse(res, 200, { message: 'User endpoint for the Sidehack API' });
});

router.get('/:id', (req, res) => {
  const { user: User } = req.app.models;

  User.findOne({ id: req.params.id })
    .then((user) => sendResponse(res, 200, { user: removePrivateFields(user) }))
    .catch((err) => {
      sendResponse(res, 400, {
        message: 'Unsupported request for the given user. Either a user does'
          + ' not exist with the given id or another error occured.'
      });
    });
})

// Returns the avatar of the user
router.get('/:id/picture', (req, res) => {
  const { user: User } = req.app.models;

  User.findOne({ id: req.params.id })
    .then((user) => sendResponse(res, 200, { url : user.avatar_url }))
    .catch((err) => {
      sendResponse(res, 400, {
        message: "Unsupported request for the given user's picture. Either the"
        + " id is incorrect or another issue occured."
      })
    });
});

export default router;
