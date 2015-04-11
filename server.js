import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jwt-simple';
import passport from 'passport';
import auth from './lib/auth';
import moment from 'moment';
import { Strategy } from 'passport-github';

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

const app = express();

app.use(passport.initialize());
app.use(cookieParser());

app.all('/api/*', auth);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new Strategy(
    { clientID, clientSecret, callbackURL },
    function (accessToken, refreshToken, profile, done) {

      // We have the user's information
      // Store access token
      const provider = 'github';

      const {
        id: provider_id,
        name,
        bio,
        email,
        avatar_url,
        html_url: github_url,
        url: github_api_url,
        public_repos: public_repos_count,
        followers: follower_count,
        following: following_count
      } = profile._json;

      const attributes = {
        provider,
        provider_id,
        name,
        bio,
        email,
        avatar_url,
        github_url,
        github_api_url,
        public_repos_count,
        follower_count,
        following_count
      };

      // Save User
      const { user: User, token: Token } = app.models;

      User.findOrCreate({ provider_id }, attributes)
        .then((user) => {
          let tokenAttributes = {
            value: accessToken,
            user: user.id
          };

          Token.findOrCreate({ value: accessToken }, tokenAttributes)
            .then((token) => {
              User.update(user.id, { token: token.id })
                .then(() => done(null, user));
            });
        })
        .catch((err) => console.error(err));
    }
  )
);

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.CLIENT_URL }),
  function(req, res) {

    // Issuing a Token
    const token = jwt.encode({
      iss: req.user.id,
      exp: moment().add(1, 'days').calendar()
    }, process.env.APP_SECRET);

    // look to add { secure: true } to this!
    res.cookie('token', token, { httpOnly: true });

    // Successful authentication, redirect home.
    res.redirect(process.env.CLIENT_DASHBOARD_URL + req.user.id);
  }
);

import router from './routes';
app.use('/api/v1', router);

app.get('*', (req, res) => {
  res.status(404).json({ status: '404', message: 'Route not found' });
})

// Database Configuration
import Waterline from 'waterline';
import User from './models/User';
import Token from './models/Token';
import config from './config';

const ORM = new Waterline();
ORM.loadCollection(User);
ORM.loadCollection(Token);

ORM.initialize(config, (err, models) => {
  if (err) throw err;

  app.models = models.collections;
  app.connections = models.connections;

  app.listen(8000);
  console.log('Server is listening on http://localhost:8000');
});
