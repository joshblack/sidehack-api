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

router.post('/', (req, res) => {
  const { user: User } = req.app.models;

  User.findOrCreate(req.body)
    .then((user) => {
      sendResponse(res, 200, { id: user.id, message: 'New User succesfully created.' });
    })
    .catch((err) => sendResponse(res, 500, {
      message: 'Server could not create user. Check the JSON payload that you submitted'
    }));
});

router.put('/:id', (req, res) => {
  const { user: User } = req.app.models;

  if (Object.keys(req.body).length === 1) {
    sendResponse(res, 500, {
      message: 'Only one property is being updated, please use PATCH instead'
    });
  }
  else {
    User.update({ id: req.params.id }, req.body)
      .then((user) => {
        sendResponse(res, 200, {
          id: user.id,
          message: 'User succesfully updated.'
        })
      })
      .catch((err) => sendResponse(res, 500, {
        message: 'Server could not update user. Check to make sure the user exists.'
      }));
  }
});

router.delete('/:id', (req, res) => {
  const { user: User } = req.app.models;

  User.destroy({ id: req.params.id })
    .then(() => sendResponse(res, 200, { message: 'User resource succesfully deleted.' }))
    .catch((err) => sendResponse(res, 500, {
      message: 'Error deleting the requested resource. Make sure the user exists'
    }));
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
