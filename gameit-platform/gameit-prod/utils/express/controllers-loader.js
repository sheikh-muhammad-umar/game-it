const glob = require('glob');
const path = require('path');

const BASE_PATH = path.resolve(`${__dirname}/../../controllers`);

/**
 * @typedef ControllerProps
 * @property {import('express')} app - Express app instance
 * @property {SequelizeConfig} db - Sequelize mapping
 */

module.exports = ( {app, db} ) => {
  const controllers = glob.sync('**/*.controller.js', {
    cwd: BASE_PATH,
  });
  
  for ( let controllerFile of controllers ) {
    require(`${BASE_PATH}/${controllerFile}`)({app, db});
  }
};
