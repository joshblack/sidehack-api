var jwt = require('jwt-simple');

export default function (req, res, next) {
  const { token } = req.cookies,
        { user: User } = req.app.models;

  if (token) {
    try {
      const decoded = jwt.decode(token, process.env.APP_SECRET);

      if (decoded.exp <= Date.now()) {
        res.status(401).json({
          status: 401,
          message: 'Access token has expired.'
        });
      }
      else {
        User.find({ id: decoded.iss })
          .then((user) => {
            req.user = user[0];
            next();
          })
          .catch((err) => {
            res.status(400).json({
              status: 400,
              message: 'Error finding the user.'
            });
          });
      }

    }
    catch (err) {
      res.status(500).json({
        status: 500,
        message: 'Internal server error.'
      });
    }
  }
  else {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized request. Please login.'
    });
  }
}
