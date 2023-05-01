const {Sequelize} = require('sequelize');

// Sequelize config
const {development} = require('./config/config');

const sequelize = new Sequelize({
  ...development,
  // Add more options
});


module.exports = sequelize;
