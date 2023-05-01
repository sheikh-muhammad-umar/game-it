'use strict';

const {generatePassword, generateAuthKey} = require('./../../utils/security/user');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = generatePassword('Password@123');
  
    await queryInterface.bulkInsert('users', [{
      fullname: 'Teacher Account',
      username: 'teacher-demo',
      email: 'teacher@gameit.ai',
      auth_key: generateAuthKey(),
      password: hash.password,
      password_hash: hash.hash,
      password_reset_token: null,
      role: 7,
      country_code: 'TR',
      language: 'en-US',
      timezone: 'UTC',
      is_active: 1,
      is_email_verified: 1,
      created_at: new Date(),
      updated_at: new Date(),
      last_login_at: null,
      deleted_at: null,
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'teacher@gameit.com',
    });
  }
};
