const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.persistent_logins"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class PersistentLogin
   * PersistentLogin model
   * @mixes {import('sequelize/types/model').Model}
   */
  const PersistentLogin = sequelize.define('PersistentLogin', {
    username: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    series: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    last_used: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'persistent_logins',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'series'},
        ]
      },
    ]
  });
  
  return PersistentLogin;
};
