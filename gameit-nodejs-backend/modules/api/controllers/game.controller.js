/** @namespace modules.api */

/**
 * Game controller
 * @constructs game.
 * @package api
 * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
 * @return {Promise<{[string]: function: Promise<Object>}>}
 */
const GameController = async fastify => {
  const {GameSession, StudentGame} = fastify.db.models;
  return ({
    /**
     * @public
     * @async
     * @memberOf modules.api
     * Initiates student's game session
     * @yields /api/games/start
     * @return {Promise<(import('fastify').RouteOptions)>}
     */
    actionStart: async () => ({
      method: 'POST',
      schema: require('./schemas/game/start.json'),
      async handler ( request ) {
        /** @type {object} */
        const {sessionId: key, ...inputs} = request.body || {};
        
        /** @type {import('sequelize').Model<GameSession>&GameSession#} */
        const model = GameSession.build();
        await model.loadDefaults();
        
        /** @type {Object} */
        const {studentId = null, gameId = null, sessionKey = null} = await StudentGame.findBySessionKey(key, {
          attribute: ['studentId', 'gameId'],
          raw: true,
        });
        
        if ( !sessionKey ) {
          throw new Error('Session key dont exists');
        }
        
        model.set({
          type: 'start',
          key,
          studentId,
          gameId,
          data: {...(inputs || {})},
        });
        
        try {
          await model.save();
        } catch ( e ) {
          console.log('Query error:', e);
          throw new Error('Unable to process game start session');
        }
        
        return {
          data: model.toJSON(),
        };
      },
    }),
    
    /**
     * @public
     * @async
     * @memberOf modules.api
     * Add student's game progress
     * @yields /api/game/progress
     * @return {Promise<(import('fastify').RouteOptions)>}
     */
    actionProgress: async () => ({
      method: 'POST',
      schema: require('./schemas/game/progress.json'),
      async handler ( request, reply ) {
        /** @type {object} */
        const {sessionId: key, ...inputs} = request.body || {};

        /** @type {import('sequelize').Model<GameSession>&GameSession#} */
        const model = GameSession.build();
        await model.loadDefaults();
        
        /** @type {Object} */
        const {studentId = null, gameId = null, sessionKey = null} = await StudentGame.findBySessionKey(key, {
          attribute: ['studentId', 'gameId'],
          raw: true,
        });
        
        if ( !sessionKey ) {
          throw new Error('Session key dont exists');
        }
        
        if ( !GameSession.isStarted(inputs.sessionId) ) {
          throw new Error('Game not started');
        }
        
        model.set({
          type: 'progress',
          key,
          studentId,
          gameId,
          data: {...(inputs || {})},
        });
        
        try {
          await model.save();
        } catch ( e ) {
          console.log('Query error:', e);
          throw new Error('Unable to process game progress request');
        }

        return {
          data: model.toJSON(),
        };
      },
    }),
    
    /**
     * @public
     * @async
     * @memberOf modules.api
     * Add student's game milestone
     * @yields /api/game/milestone
     * @return {Promise<(import('fastify').RouteOptions)>}
     */
    actionMilestone: async () => ({
      method: 'POST',
      schema: require('./schemas/game/milestone.json'),
      async handler ( request, reply ) {
        /** @type {object} */
        const {sessionId: key, ...inputs} = request.body || {};

        /** @type {import('sequelize').Model<GameSession>&GameSession#} */
        const model = GameSession.build();
        model.loadDefaults();
        
        /** @type {Object} */
        const {studentId = null, gameId = null, sessionKey = null} = await StudentGame.findBySessionKey(key, {
          attribute: ['studentId', 'gameId'],
          raw: true,
        });

        if ( !sessionKey ) {
          throw new Error('Session key dont exists');
        }
        
        if ( !GameSession.isInProgress(inputs.sessionId) ) {
          throw new Error('Game not in progress');
        }
        
        model.set({
          type: 'milestone',
          key,
          studentId,
          gameId,
          data: {...(inputs || {})},
        });
        
        try {
          await model.save();
        } catch ( e ) {
          console.log('Query error:', e);
          throw new Error('Unable to process game milestone request');
        }

        return {
          data: model.toJSON(),
        };
      },
    }),
  });
};

module.exports = GameController;