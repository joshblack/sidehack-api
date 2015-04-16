require('dotenv').load();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import jwt from 'jwt-simple';
import passport from 'passport';
import auth from './lib/auth';
import moment from 'moment';
import { Strategy } from 'passport-github';

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

const app = express();

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(passport.initialize());


app.all('/api/*', auth);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new Strategy(
    { clientID, clientSecret, callbackURL },
    function (accessToken, refreshToken, profile, done) {
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
          const tokenAttributes = {
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
    const token = jwt.encode({
      iss: req.user.id,
      exp: moment().add(1, 'days').calendar()
    }, process.env.APP_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 90000000)
    });

    res.redirect(process.env.CLIENT_URL + '/#/auth');
  }
);

import router from './routes';
app.use('/api/v1', router);

app.get('*', (req, res) => {
  res.status(404).json({ status: '404', message: 'Route not found' });
})

export default app;
