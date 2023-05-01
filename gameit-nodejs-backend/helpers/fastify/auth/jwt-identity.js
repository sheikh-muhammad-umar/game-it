/**
 * Fastify JWT/Identity Utility methods
 */

/** Native/Installed modules */
const moment = require('moment');
const cookie = require('cookie');
const {recursive} = require('merge');
const {last: R_lastItem, has: R_has} = require('ramda');

const RequestError = require('./../../../graphql/components/RequestError');

/**
 * @public
 * @see ErrorConstructor Error object
 * Create an Auth Error instance
 * @param {string} msg The message
 * @param {string} [code=403] Error code
 * @param {string} [status=Forbidden] Status type
 * @return {Error} Error object
 */
function AuthError ( msg, code = 403, status = 'Forbidden' ) {
  let err = new Error(msg);
  err.statusCode = code || 403;
  err.statusText = status || 'Forbidden';
  return err;
}

/**
 * @public
 * Get token from cookie
 * @param {(fastify#FastifyRequest|FastifyRequest)} request Fastify request instance
 * @return {string|Error} Auth token / Error object
 */
function getTokenFromCookie ( request ) {
  // Retrieve from cookie
  if ( !R_has('cookie', request.headers) ) {
    return null;
  }

  /**
   * Parsed Cookies
   * @type {Object.<string, string>}
   * @property {?string} [auth_token] JWT Auth token
   */
  const cookies = cookie.parse(request.headers.cookie);

  /**
   * Auth token
   * @type {string}
   */
  let token;

  // Retrieve value
  if ( !R_has('auth_token', cookies) || !(token = String(cookies.auth_token).trim()) ) {
    return null;
  }

  return token;
}

/**
 * Get token from authorization header (Bearer)
 * @param {fastify#FastifyRequest} request Fastify request instance
 * @return {string|Error} Auth token / Error object
 */
function getTokenFromAuthBearer ( request ) {
  // Error: Missing authorization header
  if ( !R_has('authorization', request.headers) ) {
    return null;
  }

  /**
   * Authorization header value
   * @type {string}
   */
  const header = String(request.headers['authorization']).trim();

  // Error: Empty token
  if ( !header ) {
    return null;
  }

  return String(R_lastItem(header.split(' '))).trim();
}

/**
 * Get token from all sources
 * @param {fastify#FastifyRequest} request Fastify request instance
 * @return {string|Error} JWT Auth token / Error object
 */
function getTokenFromAll ( request ) {
  /**
   * Auth token
   * @type {string}
   */
  let token = getTokenFromAuthBearer(request);

  if ( token instanceof Error ) {
    token = getTokenFromCookie(request);
  }

  return token;
}

/**
 * @constructor
 * @module jwt-identity
 * @param {FastifyServer} fastify Fastify instance
 */
module.exports = fastify => {
  const {User} = fastify.db.models;

  /**
   * MomentJS; ATOM format
   * @type {string}
   */
  const DATE_ATOM = 'YYYY-MM-DDTHH:mm:ssZ';

  /**
   * Format token timestamp into date
   * @see FastifyJwt.JwtDecoded JwtDecoded
   * @see moment.Moment.format moment.format
   * @param {number} timestamp The time stamp
   * @return {string} formatted date
   */
  function formatTokenTime ( timestamp ) {
    return moment(new Date(timestamp * 1000))
      .utc()
      .format(DATE_ATOM);
  }

  /**
   * @private
   * Get token expiration datetime
   * @see FastifyJwt.JwtDecoded JwtDecoded
   * @see moment.Moment.format moment.format
   * @param {string} issuedAt Issue ATOM date
   * @return {string}
   */
  function getExpirationDateTime ( issuedAt ) {
    /** @type {number} */
    let days = Number(process.env.JWT_EXPIRE_AFTER_DAYS || 7) || 7;

    return moment(issuedAt)
      .utc()
      .add(days, 'days')
      .format(DATE_ATOM);
  }

  /**
   * @public
   * Verify and decode JWT token
   * @see FastifyJwt.JwtDecoded FastifyJwt.JwtDecoded
   * @param {string} token - Token to be decoded
   * @param {Object} options - Additional options
   * @param {import('fastify').FastifyRequest&FastifyRequest} options.req - Fastify request instance
   * @return {FastifyJwt.JwtDecoded} - Decoded token data
   * @throws {Error} Failed to decode token
   */
  function decodeToken ( token, options = {} ) {
    const {req = {t: str => str}} = options;

    try {
      // to decode token data
      return fastify.jwt.verify(token, {
        algorithms: ['HS512'],
        issuer: process.env.JWT_ISSUER,
      });
    } catch ( err ) {
      throw new RequestError(err.message, 'INVALID_TOKEN_ERROR');
    }
  }

  /**
   * @async
   * @public
   * @see FastifyJwt.sign
   * Create JWT auth token
   * @param {string} authKey User auth key
   * @param {number} role User account type/role
   * @returns {FastifyJwt~TokenData} Token data
   * @throws {Error} Failed to create token
   */
  async function createToken ( authKey, role ) {
    const issuedAt = moment().utc().format(DATE_ATOM);
    const expiredAt = getExpirationDateTime(issuedAt);

    /** @type {FastifyJwt#JwtDecoded} */
    const token = await fastify.jwt.sign({
      iss: process.env.JWT_ISSUER,
      exp: moment(expiredAt).utc().unix(),
      idt: authKey,
      rol: role,
    }, {
      algorithm: 'HS512',
    });

    return {
      token,
      issuedAt,
      expiredAt,
    };
  }

  /**
   * @typedef {Object} FindIdentityToken
   * @property {User#} model User identity model
   * @property {Object|FastifyJwt~TokenData} decoded Decoded token data
   */

  /**
   * @private
   * @async
   * get user from data loader by auth key
   * @param {string} authKey - Authorization key
   * @param {Object} [options={}] (optional) {key:value} pairs of additional options
   * @param {import('sequelize').FindOptions} [options.query] {key:value} pairs of Sequelize query options
   * @returns {Promise<User|null>} - The model / Not found
   */
  const userFromDataLoader = async ( authKey, options ) => {
    options = recursive(true, {
      query: {},
    }, options);

    /** @type {User|null} */
    return await User.findByAuthKey(authKey, options.query);
  };

  /**
   * @public
   * @async
   * Find and get user identity from token
   * <br> Note: required attributes are: id, email, authorization_key, role, status
   * @param {string} token JWT token
   * @param {Object} [options={}] - (optional) {key:value} pairs of additional options
   * @param {import('sequelize').FindOptions} [options.query] - {key:value} pairs of Sequelize query options
   * @param {import('fastify').FastifyRequest&FastifyRequest} [options.req] - Fastify request instance
   * @return {Promise<FindIdentityToken>}
   * @throws {Error} When failed to authenticate
   */
  async function findIdentityByToken ( token, options = {} ) {
    const {req = {t: str => str}} = options;

    if ( !token ) {
      return {model: null, decoded: null};
    }

    /** @type {Object} */
    let decoded = decodeToken(token, options);

    /** @type {string} */
    const authKey = decoded['idt'] || '';


    /** @type {User|null} */
    const model = await userFromDataLoader(authKey);

    // Error: No user found
    if ( null === model ) {
      throw new RequestError(req.t('Token may invalidated or user not found'), 'INVALID_TOKEN');
    }

    // Error: User account was not active
    if ( !model.get('isActive') ) {
      throw new RequestError(req.t('Your account has been deactivated'), 'ACCOUNT_DEACTIVATED');
    }

    // Error: User account was soft deleted
    if ( model.get('deletedAt') ) {
      throw new RequestError(req.t('Your account has been deleted'), 'ACCOUNT_DELETED');
    }

    // Error: Ineligible user role
    if ( decoded['rol'] !== model.toUserRole() ) {
      throw new RequestError(req.t('Ineligible user role'), 'INELIGIBLE_ROLE');
    }

    return {model, decoded};
  }

  return {
    DATE_ATOM,
    findIdentityByToken,
    decodeToken,
    getTokenFromAll,
    createToken,
    formatTokenTime,
  };
};

