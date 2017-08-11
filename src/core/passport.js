/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../db/models/User';
import { auth as config } from '../config';
import userService from '../service/UserService';
import accountService from '../service/AccountService';

var CryptoJS = require("crypto-js");

/**
 * Sign in with username and password
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
}, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'errors.auth.invalid_username' });
    }
    if (user.auth.local.password !== (CryptoJS.MD5(password)).toString()) {
      return done(null, false, { message: 'errors.auth.invalid_password' });
    }

    return done(null, user);
  });
}));


/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret,
  callbackURL: `${process.env.HOST}/login/facebook/return`,
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  /* eslint-disable no-underscore-dangle */
  // const loginName = 'facebook';
  // const claimType = 'urn:facebook:access_token';
  const fooBar = async () => {
    if (req.user) {
      // User already logged in
      const user = await userService.findFacebookUser(profile.id);

      if (user) {
        if (user.email === req.user.email) {
          // same as logged in user
          done(null, user);
        } else {
          // There is already a Facebook account that belongs to you.
          // Sign in with that account or delete it, then link it with your current account.
          done(null);
        }
      } else {
        // Create a facebook user
        // const user = await userService.createFacebookUser(
        //   profile._json.email,
        //   profile.id
        // );
        //
        // // Log in user
        // console.log('l1', user);
        // done(null, user);

        // attach FB details to current user
      }
    } else {
      const existingFbUser = await userService.findFacebookUser(profile.id);

      if (existingFbUser) {
        // Log in user
        done(null, existingFbUser);
      } else {
        // Look for a user with same email as facebook
        const existingUser = await User.findOne({ email: profile._json.email });
        if (existingUser) {
          // There is already an account using this email address. Sign in to
          // that account and link it with Facebook manually from Account Settings.
          done(null);
        } else {
          // Create a user

          // Create a facebook user
          const user = await userService.createFacebookUser(
            profile._json.email,
            profile.id
          );

          await accountService.createAccount(user, null);

          // Log in user
          done(null, user);
        }
      }
    }
  };

  fooBar().catch(done);
}));

export default passport;
