/** Users Data Loaders */

const DataLoader = require('dataloader');

/**
 * Initializes data loaders models and their relations.
 * @param {FastifyServer} fastify - Fastify instance
 * @param {Object} loaders - Loaders container.
 */
module.exports = ( fastify, loaders ) => {
  const {User} = fastify.db.models;
  
  /**
   * User data Loaders
   * @mixin UsersDataLoader
   */
  
  /**
   * Auth Users data Loader (Key: auth_key)
   * @name UsersDataLoader.authUsers
   * @type {DataLoader}
   */
  loaders.authUsers = new DataLoader(async keys => {
    const rows = await User.findAll({
      where: {authKey: keys},
    });
  
    return keys.map(key => rows.filter(row => String(row.authKey) === String(key)));
  });
  
  /**
   * Plain Users data Loader (Key: id)
   * @name UsersDataLoader.users
   * @type {DataLoader}
   */
  loaders.users = new DataLoader(async ids => {
    const rows = await User.findAll({
      where: {id: ids},
    });
  
    return ids.map(id => rows.filter(row => Number(row.id) === Number(id)));
  });
};
