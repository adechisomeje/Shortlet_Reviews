const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  
  // Your Google OAuth strategy configuration
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, displayName, emails } = profile;
          const email = emails[0].value;
  
          // Find or create the user
          let user = await User.findOne({ email });
  
          if (!user) {
            user = new User({
              displayName,
              email,
              googleId: id,
            });
  
            await user.save();
          }
  
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );