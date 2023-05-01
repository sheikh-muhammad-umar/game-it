'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  async up ( queryInterface ) {
    await queryInterface.createTable('admins', {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: 'ID',
      },
      first_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: 'First name',
      },
      last_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '0',
        comment: 'Last name',
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Username',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Email',
      },
      auth_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Auth Key',
      },
      password: {
        type: DataTypes.STRING(90),
        allowNull: false,
        comment: 'Password',
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Password hash',
      },
      password_reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Password reset token',
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: 'Deleted',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
        comment: 'Active',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Created at',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Updated at',
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last login at',
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('admins', ['id'], {
      using: 'BTREE',
    });

    await queryInterface.addIndex('admins', ['email', 'username'], {
      unique: true,
      using: 'BTREE',
    });
  },
  
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down ( queryInterface ) {
    return queryInterface.dropTable('admins');
  }
};
