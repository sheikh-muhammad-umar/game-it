const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.hibernate_sequence"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class HibernateSequence
   * HibernateSequence model
   * @mixes {import('sequelize/types/model').Model}
   */
  const HibernateSequence = sequelize.define('hibernate_sequence', {
    next_val: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hibernate_sequence',
    timestamps: false
  });
  
  return HibernateSequence;
};
