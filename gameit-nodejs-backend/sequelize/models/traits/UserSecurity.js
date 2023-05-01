const bcryptjs = require('bcryptjs');
const {nanoid} = require('nanoid');
const {recursive} = require('merge');

const UserSecurity = require('./../../../utils/security/user');

/**
 * security trait for sequelize admin model
 * @mixin UserSecurityTrait
 * @param {import('sequelize').Model&Admin#} model - Admin model
 */
module.exports = model => {
  /**
   * Configuration params
   * @type {{passwordResetTokenLength: number, authKeyLength: number, passwordResetTokenExpire: number}}
   */
  const params = {
    /** Password token expiry in seconds */
    passwordResetTokenExpire: (3600 * 24) * 3, // days
    /** Password token chars length */
    passwordResetTokenLength: 40,
    /** Authorization key chars length */
    authKeyLength: 40,
  };
  
  /**
   * @public
   * Generates password hash from password and sets it to the model
   * @name UserSecurityTrait#setPassword
   * @param {string} password - Password to set
   * @returns {boolean} - Whether the password is correct
   */
  model.prototype.setPassword = function ( password ) {
    const hashed = UserSecurity.generatePassword(password);
    this.set('password', hashed.password);
    this.set('passwordHash', hashed.hash);
  };
  
  /**
   * @public
   * Verifies a password against a hash.
   * @name UserSecurityTrait#validatePassword
   * @param {string} password - Password to verify
   * @returns {boolean} - Whether the password is correct
   */
  model.prototype.validatePassword = function ( password ) {
    return bcryptjs.compareSync(password, this.get('passwordHash'));
  };
  
  /**
   * @public
   * Generates new password reset token
   * @name UserSecurityTrait#generatePasswordResetToken
   */
  model.prototype.generatePasswordResetToken = function () {
    /** @type {string} */
    const code = nanoid(params.passwordResetTokenLength);
    const time = UserSecurity.time();
    this.set('passwordResetToken', `${code}-${time}`);
  };
  
  /**
   * Method `findByPasswordResetToken` accepts the following options:
   * @typedef FindByPasswordResetTokenOptions
   * @property {number} expire - password reset token expire in seconds (Defaults to 3600)
   */
  
  /**
   * @public
   * @static
   * @async
   * Removes password reset token
   * @name UserSecurityTrait.findByPasswordResetToken
   * @param {string} token - Password reset token
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @param {FindByPasswordResetTokenOptions} options={} - Additional options
   * @return {Promise<User#|null>} - Promise instance (Found record / Not found)
   */
  model.findByPasswordResetToken = async ( token, findOptions = {}, options = {} ) => {
    /** @type {FindByPasswordResetTokenOptions} */
    options = recursive(true, {
      expire: params.passwordResetTokenExpire,
    }, options);
    
    /** @type {boolean} */
    const isExpired = !model.isPasswordResetTokenValid(token, options);
    
    if ( isExpired ) {
      return null;
    }
    
    /** @type {Object} */
    const seqFindOptions = recursive(true, {
      where: {
        password_reset_token: token,
      },
    }, findOptions);
    
    return await model.findOne(seqFindOptions);
  };
  
  /**
   * Method `isPasswordResetTokenValid` accepts the following options:
   * @typedef IsPasswordResetTokenValidOptions
   * @property {number} expire - Password reset token expire in seconds (Defaults to 3600)
   */
  
  /**
   * @public
   * @static
   * Finds out if password reset token is valid
   * @name UserSecurityTrait.isPasswordResetTokenValid
   * @param {string} token - Password reset token
   * @param {IsPasswordResetTokenValidOptions} options={} - Additional options
   * @return {boolean} - True when valid / False otherwise
   */
  model.isPasswordResetTokenValid = ( token, options = {} ) => {
    /** @type {IsPasswordResetTokenValidOptions} */
    options = recursive(true, {
      expire: params.passwordResetTokenExpire,
    }, options);
    
    /** @type {string} */
    const theToken = String(token).trim();
    
    if ( !theToken ) {
      return false;
    }
    
    const [timestamp] = theToken.split('-').slice(-1);
    
    if ( !timestamp || !Number(timestamp) || isNaN(timestamp) ) {
      return false;
    }
    
    /** @type {number} */
    const expire = Number(timestamp) + Number(options.expire);
    
    return expire > UserSecurity.time();
  };
  
  /**
   * @public
   * Removes password reset token
   * @name UserSecurityTrait#removePasswordResetToken
   */
  model.prototype.removePasswordResetToken = function () {
    this.set('passwordResetToken', '');
  };
  
  

	/**
   * @public
   * @name UserSecurityTrait#getAuthKey
   * Returns a key that can be used to check the validity of a given identity ID.
   * @returns {string} - Auth key
   */
  model.prototype.getAuthKey = function () {
    return this.get('authKey');
  };

	/**
   * @public
   * @name UserSecurityTrait#validateAuthKey
   * Validates the given auth key
   * @param {string} authKey - The given auth key
   * @returns {boolean} - True when valid / False otherwise
   */
  model.prototype.validateAuthKey = function ( authKey ) {
    return authKey === this.getAuthKey();
  };

	/**
   * @public
   * @name UserSecurityTrait#generateAuthKey
   * Generates token authentication key
   */
  model.prototype.generateAuthKey = function () {
    this.set('authKey', UserSecurity.generateAuthKey());
  };
};
