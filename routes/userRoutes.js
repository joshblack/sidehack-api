import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200);
  res.json({
    status: 200,
    message: 'User endpoint for the Sidehack API'
  });
})

// Returns the avatar of the user
router.get('/:id/picture', (req, res) => {
  const { user: User } = req.app.models;

  User.findOne({ id: req.params.id })
    .then((user) => {
      res.status(200);
      res.json({
        status: 200,
        url: user.avatar_url
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.json({
        status: 400,
        message: "Unsupported request for the given user's picture. Either the"
        + " id is incorrect or another issue occured."
      })
      res.end();
    });
});

export default router;
