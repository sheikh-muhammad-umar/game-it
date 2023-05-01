/**
 * Fastify portal controller
 */

 const httpErrors = require('http-errors');
 const path = require('path');

 /**
  * Portal controller
  * @description fastify routes
  * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
  * @param {Object} opts - Plugin options
  * @param {function(): void} next - Next function
  */
 module.exports = async ( fastify, opts, next ) => {
 	fastify
    .register(require('@fastify/static'), {
        root: path.join(__dirname, '..','..','..','dist','gameit-portal'),
        prefix: '/portal',
        prefixAvoidTrailingSlash: true,
        list: false
      })      
    ;
    next();
 };
 