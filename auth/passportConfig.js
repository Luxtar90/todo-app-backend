const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Configuración de Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.displayName,
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Configuración de Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }] });
    if (!user) {
      user = new User({
        facebookId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.displayName,
      });
      await user.save();
    } else {
      if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
      }
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
