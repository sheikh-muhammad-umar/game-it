const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.user"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class User
   * User model
   * @mixes {import('sequelize/types/model').Model}
   */
  const User = sequelize.define('User', {
    userid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creation_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_seen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    updated_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    reset_password_token: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'userid'},
        ]
      },
    ]
  });
  
  /**
   * @const
   * @static
   * User Type: Student
   * @type {string}
   */
  User.TYPE_STUDENT = 'student';
  
  /**
   * @const
   * @static
   * User Type: Guardian
   * @type {string}
   */
  User.TYPE_GUARDIAN = 'guardian';
  
  /**
   * @const
   * @static
   * User Type: Teacher
   * @type {string}
   */
  User.TYPE_TEACHER = 'teacher';
  
  return User;
};
