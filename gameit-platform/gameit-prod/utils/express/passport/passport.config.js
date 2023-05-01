const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const op = require('object-path');

/**
 * Env variables
 * @type {objectPath~ObjectPathBound} */
const env = op(process.env || {});

/**
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports.initializePassport = ( {db} ) => {
  const {Admin} = db;
  passport.use(
    new JwtStrategy({
      secretOrKey: env.get('JWT_SECRET', ''),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS512'],
      issuer: 'gameit.ai',
    }, async ( jwt, done ) => {
      try {
        const entity = await Admin.findByAuthKey(jwt.token);
        return entity === null
          ? done(null, false)
          : done(null, entity);
      } catch ( error ) {
        return done(error, false);
      }
    })
  );
  
  
  passport.serializeUser(async ( /** @type {Admin#} */ entity, done ) => {
    done(null, entity.authKey);
  });
  
  passport.deserializeUser(async ( authKey, done ) => {
    try {
      /** @type {Admin#} */
      const entity = await Admin.findByAuthKey(authKey);
      done(null, entity);
    } catch ( error ) {
      done(error, false);
    }
  });
};
