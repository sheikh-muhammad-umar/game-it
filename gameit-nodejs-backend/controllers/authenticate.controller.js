/**
 * Fastify index controller
 */

const path = require('path');

/**
 * Authenticate controller
 * @description fastify routes
 * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
 * @param {Object} opts - Plugin options
 * @param {function(): void} next - Next function
 */
module.exports = async ( fastify, opts, next ) => {
    fastify
        /**
         * @type frontend
         * User login (redirect) */
        .get('/login', async (req, res) => {
            res.redirect('/portal/login');
        })

            /**
             * @type frontend
             * User register (redirect) */
        .get('/register', async (req, res) => {
            res.redirect('/portal/register');
        })

        /** Not-found page handler route */
        .register(function (instance, options, done) {
            instance.setNotFoundHandler(function (request, reply) {
                prefix = new RegExp('/portal.*')
                if (prefix.test(request.url)) {
                    reply.sendFile('index.html', path.join(__dirname, '..','dist','gameit-portal'))
                } else {
                    reply.sendFile('index.html', path.join(__dirname, '..','dist','gameit-www'))
                }
            })
            done()
        })
    ;

    next();
};
