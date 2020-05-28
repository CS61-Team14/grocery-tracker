/* 	Passport Configuration
	  Based on https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/passport-config.js
*/

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.secretOrKey = process.env.AUTH_SECRET;

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    console.log("email: "+email+ " Password: "+password);
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    const user = getUserById(jwt_payload.sub);
    // User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }));


  // passport.serializeUser((user, done) => done(null, user.id));
  // passport.deserializeUser((id, done) => {
  //   return done(null, getUserById(id))
  // });
}

module.exports = initialize;