var jwt = require('jwt-simple');

// Verifying a token
// 1. Check for an attached token.
// 2. Attempt to decode it.
// 3. Check the validity of the token.
// 4. If the token is valid, retrieve the correponding user record
//    and attach it to the request object.

// We can allow the client to attach a token in one of three ways
//    – as a query string parameter
//    - a form body parameter
//    - or in an HTTP header.
//
// We’ll just use the header x-access-token.
export default function (req, res, next) {
  const { token } = req.cookies;

  if (token) {
    try {
      var decoded = jwt.decode(token, process.env.APP_SECRET);

      // decoded = { iss: 1, exp: 1428962454083 }
      if (decoded.exp <= Date.now()) {
        res.status(403).json({
          status: 403,
          msg: 'Access token has expired'
        })
      }
      else {
        console.log(decoded);
        // find user and stick them onto request
        req.user = { user: 1, name: 'josh' }
        next();
      }

    }
    catch (err) {
      console.error(err);
      next();
    }
  }
  else {
    res.status(401);
    res.json({
      status: 401,
      message: 'Unauthorized request. Please login.'
    });
  }
}
