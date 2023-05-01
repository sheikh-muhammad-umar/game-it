const path = require('path');
const glob = require('glob');
const Sequelize = require('sequelize');

/**
 * @typedef SequelizeConfig
 * @type {Object}
 * @property {import('sequelize')} sequelize - Sequelize instance
 * @property {import('sequelize').Sequelize} Sequelize - Sequelize constructor
 * @property {import('sequelize/types/model').ModelStatic&Admin.} Admin - Admin model
 * @property {import('sequelize/types/model').ModelStatic&Class.} Class - Class model
 * @property {import('sequelize/types/model').ModelStatic&CoinTransaction.} CoinTransaction - CoinTransaction model
 * @property {import('sequelize/types/model').ModelStatic&ConfirmationToken.} ConfirmationToken - ConfirmationToken model
 * @property {import('sequelize/types/model').ModelStatic&GameSession.} GameSession - GameSession model
 * @property {import('sequelize/types/model').ModelStatic&GameToSkill.} GameToSkill - GameToSkill model
 * @property {import('sequelize/types/model').ModelStatic&GoalByGuardian.} GoalByGuardian - GoalByGuardian model
 * @property {import('sequelize/types/model').ModelStatic&Guardian.} Guardian - Guardian model
 * @property {import('sequelize/types/model').ModelStatic&GuardianToStudent.} GuardianToStudent - GuardianToStudent model
 * @property {import('sequelize/types/model').ModelStatic&HibernateSequence.} HibernateSequence - HibernateSequence model
 * @property {import('sequelize/types/model').ModelStatic&Level.} Level - Level model
 * @property {import('sequelize/types/model').ModelStatic&PersistentLogin.} PersistentLogin - PersistentLogin model
 * @property {import('sequelize/types/model').ModelStatic&Skill.} Skill - Skill model
 * @property {import('sequelize/types/model').ModelStatic&SkillToLevel.} SkillToLevel - SkillToLevel model
 * @property {import('sequelize/types/model').ModelStatic&Student.} Student - Student model
 * @property {import('sequelize/types/model').ModelStatic&StudentGame.} StudentGame - StudentGame model
 * @property {import('sequelize/types/model').ModelStatic&StudentMilestone.} StudentMilestone - StudentMilestone model
 * @property {import('sequelize/types/model').ModelStatic&Teacher.} Teacher - Teacher model
 * @property {import('sequelize/types/model').ModelStatic&User.} User - User model
 * @property {import('sequelize/types/model').ModelStatic&UserToClass.} UserToClass - UserToClass model
 * @property {import('sequelize/types/model').ModelStatic&UserToGame.} UserToGame - UserToGame model
 * @property {import('sequelize/types/model').ModelStatic&Visitor.} Visitor - Visitor model
 */

// Init sequelize instance
const sequelize = require('./instance');
const db = {};

glob.sync('*.js', {cwd: `${__dirname}/models`})
  .forEach(file => {
    const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  db[modelName].associate && db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
