/* 	Passport Configuration
	  Based on https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/passport-config.js
*/

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config({ silent: true });

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader("authorization");
opts.secretOrKey = process.env.AUTH_SECRET;

// function initialize(passport, getUserByEmail, getUserById) {
function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    console.log("email: " + email + " Password: " + password);
    // const user = await getUserByEmail(email);
    global.connection.query(
      "SELECT * FROM Users WHERE UserEmail= ?",
      [email],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
          user = {
            UserID: results[0].UserID,
            UserName: results[0].UserName,
            UserEmail: email,
            UserPassword: results[0].UserPassword,
          };
          console.log("User is: " + JSON.stringify(user));
          if (user == null) {
            return done(null, false, { message: "No user with that email" });
          }
          try {
            bcrypt.compare(password, user.UserPassword, function (err, result) {
              if (result) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          } catch (e) {
            console.log(e);
            return done(e);
          }
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "UserEmail", passwordField: "UserPassword" },
      authenticateUser
    )
  );

  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      global.connection.query(
        "SELECT * FROM Users WHERE UserEmail= ?",
        [jwt_payload.sub],
        function (error, results, fields) {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            user = {
              UserID: results[0].UserID,
              UserName: results[0].UserName,
              UserEmail: email,
              UserPassword: results[0].UserPassword,
            };
            console.log("User is: " + JSON.stringify(user));
            if (user == null) {
              return done(null, false);
            } else {
              return done(null, user);
            }
          }
        }
      );
    })
  );

  // passport.serializeUser((user, done) => done(null, user.id));
  // passport.deserializeUser((id, done) => {
  //   return done(null, getUserById(id))
  // });
}

module.exports = initialize;
