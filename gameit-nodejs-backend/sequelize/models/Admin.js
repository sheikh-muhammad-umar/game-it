/** @namespace SequelizeModels */

const {recursive} = require('merge');
const Sequelize = require('sequelize');
const {Op} = Sequelize;

/**
 * This is the model class for table "gameit_pf_global.admins"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Object}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Admin
   * Admin model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes AdminSecurityTrait
   */
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
      field: 'id',
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: 'First name',
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: 'Last name',
      field: 'last_name',
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Username',
      field: 'username',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email',
      unique: 'IDX_admin_email',
      field: 'email',
    },
    authKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Auth Key',
      field: 'auth_key',
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Password',
      field: 'password',
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Password hash',
      field: 'password_hash',
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Password reset token',
      field: 'password_reset_token',
    },
    deleted: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: 'Deleted',
      field: 'deleted',
    },
    active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: 'Active',
      field: 'active',
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
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last login at',
      field: 'last_login_at',
    },
  }, {
    sequelize,
    tableName: 'admins',
    timestamps: true,
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
        name: 'IDX_admin_id',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ],
      },
      {
        name: 'IDX_admin_email',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'email'},
        ],
      },
    ],
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
      where: {username},
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
      where: {authKey: key},
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
      where: {email},
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
