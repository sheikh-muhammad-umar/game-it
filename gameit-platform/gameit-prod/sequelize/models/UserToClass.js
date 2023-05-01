const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.usertoclass"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class UserToClass
   * UserToClass model
   * @mixes {import('sequelize/types/model').Model}
   */
  const UserToClass = sequelize.define('UserToClass', {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ClassID: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'usertoclass',
    timestamps: false
  });
  
  return UserToClass;
};
