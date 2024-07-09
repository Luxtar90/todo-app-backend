const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',  // Asegúrate de que esta URL esté completa y correcta
},
async (token, tokenSecret, profile, done) => {
  try {
    console.log('Google profile:', profile);  // Log del perfil de Google

    // Busca al usuario por su Google ID o por su email
    let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });

    // Si el usuario no existe, crea uno nuevo
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.displayName,
      });
      await user.save();
      console.log('New user created:', user);  // Log del nuevo usuario creado
    } else {
      // Si el usuario existe pero no tiene googleId, se lo añadimos
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
        console.log('Updated user with googleId:', user);  // Log del usuario actualizado
      } else {
        console.log('User found:', user);  // Log del usuario encontrado
      }
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in Google Strategy:', error);  // Log de errores
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
