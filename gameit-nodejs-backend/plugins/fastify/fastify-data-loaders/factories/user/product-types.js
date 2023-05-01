/** Roles Data Loaders */

const DataLoader = require('dataloader');

/**
 * Initializes data loaders models and their relations.
 * @param {FastifyServer} fastify - Fastify instance
 * @param {Object} loaders - Loaders container.
 */
module.exports = ( fastify, loaders ) => {
  const {ProductType} = fastify.db.models;
  
  /**
   * Role data Loaders
   * @mixin ProductTypesDataLoader
   */
  
  /**
   * Product types data Loader (Key: meta.type)
   * @name ProductTypesDataLoader.permissionsModule
   * @type {DataLoader}
   */
  loaders.productTypes = new DataLoader(async types => {
    const rows = await ProductType.findAll({
      where: {
        'meta.type': types,
      },
      raw: true,
    });
    
    return types.map(type => rows.filter(row => row.meta.type === type));
  });
};
