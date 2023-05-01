/** @namespace SequelizeModels */

const {recursive} = require('merge');
const moment = require('moment');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
const {invertObj: R_invertObj} = require('ramda');
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.users"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): User}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class User
   * User model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes UserSecurityTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const User = sequelize.define('User', {
    /**
     * ID
     * @memberOf User#
     * @type {number}
     */
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
      field: 'id',
    },
    /**
     * Fullname
     * @memberOf User#
     * @type {string}
     */
    fullName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Full name',
      field: 'fullname',
    },
    /**
     *  Username
     * @memberOf User#
     * @type {string}
     */
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Username',
      unique: 'UNQ_users_username',
      field: 'username',
    },
    /**
     * Email address
     * @memberOf User#
     * @type {string}
     */
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email address',
      unique: 'UNQ_users_email',
      field: 'email',
    },
    /**
     * Auth key
     * @memberOf User#
     * @type {string}
     */
    authKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Auth key',
      unique: 'UNQ_users_auth_key',
      field: 'auth_key',
    },
    /*
     *  Password
     * @memberOf User#
     * @type {string}
     */
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Password',
      field: 'password',
    },
    /**
     * Password hash
     * @memberOf User#
     * @type {string}
     */
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Password hash',
      field: 'password_hash',
    },
    /**
     * Password reset token
     * @memberOf User#
     * @type {string}
     */
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Password reset token',
      field: 'password_reset_token',
    },
    /**
     * Role
     * @memberOf User#
     * @type {number}
     */
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Role',
      field: 'role',
    },
    /**
     * Country Code
     * @memberOf User#
     * @type {string}
     */
    countryCode: {
      type: DataTypes.STRING(8),
      allowNull: false,
      comment: 'Country code',
      field: 'country_code',
    },
    /**
     * Language
     * @memberOf User#
     * @type {string}
     */
    language: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: 'Language',
      field: 'language',
    },
    /**
     * Timezone
     * @memberOf User#
     * @type {string}
     */
    timezone: {
      type: DataTypes.STRING(25),
      allowNull: false,
      comment: 'Timezone',
      field: 'timezone',
    },
    /**
     * Active
     * @memberOf User#
     * @type {number}
     */
    isActive: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Active',
      field: 'is_active',
    },
    /**
     * Email verified
     * @memberOf User#
     * @type {number}
     */
    isEmailVerified: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Email verified',
      field: 'is_email_verified',
    },
    /**
     * Created at
     * @memberOf User#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf User#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
    /**
     * Deleted at
     * @memberOf User#
     * @type {string}
     */
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
    /**
     * Last login at
     * @memberOf User#
     * @type {string}
     */
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last login at',
      field: 'last_login_at',
    },
    /**
     * Meta data
     * @memberOf User#
     * @type {Object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta Data',
      field: 'meta',
    },
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ],
      },
      {
        name: 'UNQ_users_email',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'email'},
        ],
      },
      {
        name: 'UNQ_users_username',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'username'},
        ],
      },
      {
        name: 'UNQ_users_auth_key',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'auth_key'},
        ],
      },
      {
        name: 'IDX_users_id',
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ],
      },
      {
        name: 'IDX_users_role',
        using: 'BTREE',
        fields: [
          {name: 'role'},
        ],
      },
      {
        name: 'IDX_users_country',
        using: 'BTREE',
        fields: [
          {name: 'country'},
        ],
      },
    ],
  });
  
  //<editor-fold desc="Role/Type constants">
  /**
   * @readonly
   * @const {number}
   * @default 1
   */
  User.TYPE_STUDENT = 1;
  /**
   * @readonly
   * @const {number}
   * @default 3
   */
  User.TYPE_GUARDIAN = 3;
  /**
   * @readonly
   * @const {number}
   * @default 7
   */
  User.TYPE_TEACHER = 7;
  /**
   * @readonly
   * @const {number}
   * @default 9
   */
  User.TYPE_SCHOOL_ADMIN = 9;
  /**
   * @readonly
   * @const {number}
   * @default 11
   */
  User.TYPE_PLATFORM_ADMIN = 11;
  
  /**
   * @readonly
   * @const {string}
   * @default 'STUDENT'
   */
  User.ROLE_STUDENT = 'STUDENT';
  
  /**
   * @readonly
   * @const {string}
   * @default 'TEACHER'
   */
  User.ROLE_TEACHER = 'TEACHER';
  /**
   * @readonly
   * @const {string}
   * @default 'GUARDIAN'
   */
  User.ROLE_GUARDIAN = 'GUARDIAN';
  /**
   * @readonly
   * @const {string}
   * @default 'SCHOOL_ADMIN'
   */
  User.ROLE_SCHOOL_ADMIN = 'SCHOOL_ADMIN';
  /**
   * @readonly
   * @const {string}
   * @default 'PLATFORM_ADMIN'
   */
  User.ROLE_PLATFORM_ADMIN = 'PLATFORM_ADMIN';
  //</editor-fold>
  
  /** use-of traits */
  require('./traits/UserSecurity')(User);
  Traits.use(User, [
    Traits.TRAIT_JSON_ATTRIBUTE,
    Traits.TRAIT_PAGINATION_NUMBER,
    Traits.TRAIT_PAGINATION_CURSOR,
    Traits.TRAIT_TYPE_ATTRIBUTE,
    Traits.TRAIT_ORM_ATTRIBUTES,
  ]);
  
  /**
   * @async
   * @public
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  User.prototype.loadDefaults = async function () {
    this.set({
      countryCode: 'SA',
      language: 'en-US',
      timezone: 'UTC',
    });
    this.setJsonValue('activation', {
      pending: true,
      verifyCode: null,
      requestedAt: null, // Datetime stamp
      expiredAt: null, // Datetime stamp
      completedAt: null, // Datetime stamp
    });
  };
  
  /**
   * @public
   * Returns an ID that can uniquely identify a user identity.
   * @returns {number|null}
   */
  User.prototype.getId = function () {
    const [id] = [...User.primaryKeyAttributes].splice(0, 1);
    
    /** @type {number} */
    const PK = +this.get(id);
    
    return !PK || isNaN(PK) ? null : PK;
  };
  
  /**
   * @public
   * Get user's first name
   * @returns {string}
   */
  User.prototype.getFirstName = function () {
    return this.get('fullName').split(' ')[0];
  };
  
  /**
   * @public
   * Get user role by account type
   * @returns {string} The role
   */
  User.prototype.toUserRole = function () {
    return User.getRoles(true)[+this.get('role')];
  };
  
  /**
   * @public
   * @static
   * Get user roles
   * @param {boolean} flip=false - Flip Type values with role keys
   * @returns {{string: number}|{number: string}} - User roles {role:type|type:role}
   */
  User.getRoles = ( flip = false ) => {
    const roles = {
      [User.ROLE_GUARDIAN]: User.TYPE_GUARDIAN,
      [User.ROLE_PLATFORM_ADMIN]: User.TYPE_PLATFORM_ADMIN,
      [User.ROLE_TEACHER]: User.TYPE_TEACHER,
      [User.ROLE_SCHOOL_ADMIN]: User.TYPE_SCHOOL_ADMIN,
      [User.ROLE_STUDENT]: User.TYPE_STUDENT,
    };

    return flip
      ? R_invertObj(roles)
      : roles;
  };
  
  /**
   * @public
   * @static
   * Get user role by account type
   * @param {number} type - Account type
   * @returns {?number} - User role / Not found
   */
  User.typeToRole = ( type ) => {
    const roles = User.getRoles(true);
    
    return roles.hasOwnProperty(type)
      ? roles[type]
      : null;
  };
  
  /**
   * @public
   * @static
   * Get account type from user role
   * @param {string} role - User role (use User.ROLE_*)
   * @returns {number|null} - Account Type / Not found
   */
  User.roleToAccountType = ( role ) => {
    const types = User.getRoles();
    
    return types.hasOwnProperty(role)
      ? types[role]
      : null;
  };
  
  /**
   * @public
   * Check that current user has given role or not
   * @param {'GUARDIAN'|'STUDENT'|'TEACHER'|'SCHOOL_ADMIN'} role - User type to check (e.g., User.ROLE_*)
   * @returns {boolean} - True when ok / false otherwise
   */
  User.prototype.isRole = function ( role ) {
    return User.typeToRole(+this.get('role')) === role;
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Find record by username
   * @param {string} username - Username to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<User|Object|null>}
   */
  User.findByUsername = async ( username, findOptions = {} ) => {
    return User.findOne(recursive(false, {
      where: {username},
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Find record by email address
   * @param {string} email - Email Address
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<User|Object|null>}
   */
  User.findByEmail = async ( email, findOptions = {} ) => {
    return User.findOne(recursive(false, {
      where: {email},
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Find record by auth keys
   * @param {string} key - Key to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<User|Object|null>}
   */
  User.findByAuthKey = async ( key, findOptions = {} ) => {
    return User.findOne(recursive(false, {
      where: {authKey: key},
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Find record by email address or username
   * @param {string} value - Value to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<User#|Object|null>}
   */
  User.findByEmailOrUsername = async ( value, findOptions = {} ) => {
    return await User.findOne(recursive(false, {
      where: {
        [Op.or]: {
          username: value,
          email: value,
        },
      },
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Get user's fullname by ID
   * @param {number} id - PK
   * @returns {Promise<?string>} / Null when not found / otherwise fullname
   */
  User.getName = async id => {
    /** @type {?({name: string})} */
    const record = await User.findByPk(id, {
      attributes: [['fullName', 'name']],
      raw: true,
    });
  
    return !record ? null : record.name;
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Check that given username exists
   * @param {string} value - Value to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<boolean>}
   */
  User.usernameExists = async ( value, findOptions = {} ) => {
    return Boolean(await User.count(recursive(false, {
      where: {
        username: value,
      },
    }, findOptions)));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf User.
   * Check that given email exists
   * @param {string} value - Value to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<boolean>}
   */
  User.emailExists = async ( value, findOptions = {} ) => {
    return Boolean(await User.count(recursive(false, {
      where: {
        email: value,
      },
    }, findOptions)));
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {User#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  User.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const model = op(record instanceof User ? record.toJSON() : record);
    
    const [firstName, lastName] = model.get('fullName').split(' ');
    
    return {
      id: +model.get('id'),
      firstName,
      lastName,
      username: model.get('username'),
      email: model.get('email'),
      language: model.get('language'),
      timezone: model.get('timezone'),
      countryCode: model.get('countryCode'),
      role: {
        value: +model.get('role'),
        // title: record.toType(),
        // type: record.toUserRole(),
      },
      created: moment(model.get('createdAt')).utc().toISOString(),
    };
  };
  
  /**
   * @public
   * @static
   * @async
   * Transform raw record into graphql owner object (filters basic user info)
   * @param {User#} model - User model to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Promise<Object>} - Promise instance - Transformed object
   */
  User.toGraphMeObject = async ( model, language = null ) => {
    const [firstName, lastName] = model.get('fullName').split(' ');
    
    return {
      id: +model.get('id'),
      firstName,
      lastName,
      username: model.get('username'),
      email: model.get('email'),
      language: model.get('language'),
      timezone: model.get('timezone'),
      countryCode: model.get('countryCode'),
      role: {
        value: +model.get('role'),
        title: model.toType(),
        type: model.toUserRole(),
      },
      created: moment(model.createdAt).utc(true).toISOString(),
    };
  };
  
  return User;
};
