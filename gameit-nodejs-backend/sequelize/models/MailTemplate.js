/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');
const {recursive} = require('merge');

// Utils
const Traits = require('../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.users'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): MailTemplate}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class MailTemplate
   * MailTemplate model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   */
  const MailTemplate = sequelize.define(
    'MailTemplate',
    {
      /**
       * ID
       * @memberOf MailTemplate#
       * @type {number}
       */
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        comment: 'ID',
      },
      /**
       * Name
       * @memberOf MailTemplate#
       * @type {string}
       */
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name',
      },
      /**
       * Lable
       * @memberOf MailTemplate#
       * @type {string}
       */
      label: {
        type: DataTypes.STRING(80),
        allowNull: false,
        comment: 'Label',
        unique: 'UNQ_mail_templates_label',
      },
      /**
       * Meta
       * @memberOf MailTemplate#
       * @type {Object}
       */
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Meta',
      },
      /**
       * Active
       * @memberOf MailTemplate#
       * @type {boolean}
       */
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Active',
        field: 'is_active',
      },
      /**
       * Created at
       * @memberOf MailTemplate#
       * @type {string}
       */
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
      /**
       * Updated at
       * @memberOf MailTemplate#
       * @type {string}
       */
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'mail_templates',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{name: 'id'}],
        },
        {
          name: 'UNQ_mail_templates_label',
          unique: true,
          using: 'BTREE',
          fields: [{name: 'label'}],
        },
        {
          name: 'IDX_mail_templates_is_active',
          using: 'BTREE',
          fields: [{name: 'is_active'}],
        },
      ],
    },
  );
  
  /** use-of traits */
  require('./traits/UserSecurity')(MailTemplate);
  Traits.use(MailTemplate, [
    Traits.TRAIT_JSON_ATTRIBUTE,
    Traits.TRAIT_ORM_ATTRIBUTES,
  ]);
  
  /**
   * @async
   * @public
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  MailTemplate.prototype.loadDefaults = async function () {
    this.setJsonValue('languages', {
      ar_SA: {templateId: null, subject: null},
      en_US: {templateId: null, subject: null},
    });
  };
  
  /**
   * @async
   * @public
   * @static
   * Find template by the given label
   * @param {string} label - Label to find
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @returns {Promise<import('sequelize').Model<MailTemplate>&MailTemplate|Object|null>}
   */
  MailTemplate.findByLabel = async ( label, findOptions = {} ) => {
    return MailTemplate.findOne(recursive(false, {
      where: {
        label,
      },
    }, findOptions));
  };
  
  return MailTemplate;
};
