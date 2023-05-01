const {countries} = require('countries-list');

// Utils
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  defs.School.country = {
    async country ( root, args, ctx, info ) {

      const { request } = ctx;

      if ( !countries.hasOwnProperty(root.country) ) {
        throw new RequestError (request.t('Unknown country code'), 'UNKNOWN_COUNTRY_CODE');
      }

      const country = countries[root.country];

      return {
        name: args.native ? country.native : country.name,
        code: root.country,
      };
    }
  };

  defs.MemberSchool.country = {
    async country ( root, args, ctx, info ) {
      if ( !countries.hasOwnProperty(root.country) ) {
        throw new RequestError (request.t('Unknown country code'), 'UNKNOWN_COUNTRY_CODE');
      }

      const country = countries[root.country];

      return {
        name: args.native ? country.native : country.name,
        code: root.country,
      };
    }
  };
};
