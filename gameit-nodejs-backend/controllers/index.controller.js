/**
 * Fastify index controller
 */

 const httpErrors = require('http-errors');
 const path = require('path');
 
 /**
  * Main controller
  * @description fastify routes
  * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
  * @param {Object} opts - Plugin options
  * @param {function(): void} next - Next function
  */
 module.exports = async ( fastify, opts, next ) => {
	 fastify
		 /** Homepage */
		 .get('/', async (req, res) => {
			 res.redirect('/www');
		   })

		 /** Server status */
		 .get('/status', async () => ({status: 'OK'}))

		 /** Language checker */
		 .get('/language',
			 /**
			  * @param {import('fastify/types/request').FastifyRequest&FastifyRequest} req - Fastify request instance
			  */
			 async (req) => ({
				 locale: req.locale,
				 Welcome: req.t(),
			 }))

		 /** Hack: Send 204 for all OPTIONS request */
		 .options('*', ( req, reply ) => reply.send(204))
		 ;
 
	 next();
 };
 