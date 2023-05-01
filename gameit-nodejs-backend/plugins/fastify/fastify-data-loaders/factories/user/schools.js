/** Roles Data Loaders */

const DataLoader = require('dataloader');

/**
 * Initializes data loaders models and their relations.
 * @param {FastifyServer} fastify - Fastify instance
 * @param {Object} loaders - Loaders container.
 */
module.exports = ( fastify, loaders ) => {
  const {School} = fastify.db.models;
  
  /**
   * School data Loaders
   * @mixin SchoolsDataLoader
   */
  
  /**
   * Roles data Loader (Key: id)
   * @name SchoolsDataLoader.roles
   * @type {DataLoader}
   */
  loaders.roles = new DataLoader(async ids => {
    const rows = await School.findAll({
      where: {
        id: ids,
        isActive: true,
      },
      raw: true,
    });
    
    return ids.map(id => rows.filter(row => Number(row.id) === Number(id)));
  });
};
