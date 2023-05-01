const {recursive} = require('merge');
const Sequelize = require('sequelize');
const {Op} = Sequelize;

/**
 * This is the model class for table "gameit-pf.admin"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Admin
   * Admin model
   * @mixes {import('sequelize/types/model').Model}
   * @mixes AdminSecurityTrait
   */
  const Admin = sequelize.define('Admin',{
    /**
     * ID
     * @memberOf Admin#
     * @type {string}
     */
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'id',
    },
    /**
     * Email address
     * @memberOf Admin#
     * @type {string}
     */
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email',
    },
    /**
     * First name
     * @memberOf Admin#
     * @type {string}
     */
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'first_name',
    },
    /**
     * Last name
     * @memberOf Admin#
     * @type {string}
     */
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: '0',
      field: 'last_name',
    },
    /**
     * Password
     * @memberOf Admin#
     * @type {string}
     */
    password: {
      type: DataTypes.STRING(90),
      allowNull: false,
      field: 'password',
    },
    /**
     * Auth key
     * @memberOf Admin#
     * @type {string}
     */
    authKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'auth_key',
    },
    /**
     * Password hash
     * @memberOf Admin#
     * @type {string}
     */
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    /**
     * Password reset token
     * @memberOf Admin#
     * @type {string}
     */
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_reset_token',
    },
    /**
     * Username
     * @memberOf Admin#
     * @type {string}
     */
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'username',
    },
    /**
     * Active
     * @memberOf Admin#
     * @type {string}
     * @default 0
     */
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      field: 'active',
    },
    /**
     * Deleted
     * @memberOf Admin#
     * @type {string}
     */
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'deleted',
    },
    /**
     * Last login at
     * @memberOf Admin#
     * @type {string}
     */
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
    /**
     * Created at
     * @memberOf Admin#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Admin#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'admin',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ]
      },
    ]
  });
  
  /** use-of traits */
  require('./traits/AdminSecurity')(Admin);
  
  /**
   * @async
   * @public
   * @static
   * @memberOf Admin.
   * Find record by username
   * @param {string} username - Username to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<Admin|Object|null>}
   */
  Admin.findByUsername = async ( username, findOptions = {} ) => {
    return Admin.findOne(recursive(false, {
      where: { username },
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf Admin.
   * Find record by auth keys
   * @param {string} key - Key to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<Admin|Object|null>}
   */
  Admin.findByAuthKey = async ( key, findOptions = {} ) => {
    return Admin.findOne(recursive(false, {
      where: { authKey: key },
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf Admin.
   * Find record by email address
   * @param {string} email - Email Address
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<Admin|Object|null>}
   */
  Admin.findByEmail = async ( email, findOptions = {} ) => {
    return Admin.findOne(recursive(false, {
      where: { email },
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf Admin.
   * Find record by email address or username
   * @param {string} value - Value to find
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<Admin#|Object|null>}
   */
  Admin.findByEmailOrUsername = async ( value, findOptions = {} ) => {
    return await Admin.findOne(recursive(false, {
      where: {
        [Op.or]: {
          username: value,
          email: value,
        },
      },
    }, findOptions));
  };
  
  return Admin;
};
