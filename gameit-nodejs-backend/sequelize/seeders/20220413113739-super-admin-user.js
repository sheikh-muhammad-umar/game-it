'use strict';

const {generatePassword, generateAuthKey} = require('./../../utils/security/admin');

module.exports = {
  async up ( queryInterface ) {
    const hash = generatePassword('Password@123');
    
    await queryInterface.bulkInsert('admins', [{
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@gameit.com',
      auth_key: generateAuthKey(),
      password: hash.password,
      password_hash: hash.hash,
      username: 'admin',
      active: false,
      deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
      last_login_at: null,
    }]);
  },
  
  async down ( queryInterface ) {
    await queryInterface.bulkDelete('admins', {
      email: 'admin@gameit.com',
    });
  },
};
