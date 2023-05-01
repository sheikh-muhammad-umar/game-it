/**
 * Fastify routes definition file autoloader
 */

/** Native/Installed modules */
const fp = require('fastify-plugin');
const glob = require('glob');
const path = require('path');
const op = require('object-path');
const changeCase = require('change-case');
const {is: R_is} = require('ramda');

// Utils
const Path = require('./../../../utils/core/path');

/**
 * @callback ModuleConfiguration.onInit
 * @param {import('fastify/types/instance').FastifyInstance<FastifyServer>} app - Fastify server instance
 * @returns {Promise<void>}
 */

/**
 * @typedef ModuleConfiguration
 * @property {string} controllersPath - Absolute controllers dir path <i style="color:red">(required)</i>
 * @property {string} [route] - Module route path
 * @property {ModuleConfiguration.onInit} [onInit] - A callback to trigger when module initialed.
 * @property {{[string]: any}} [options={}] - Options to pass on each controller
 * @property {{[string]: any}} [options.routes={}] - Routes option to pass all module actions
 * @property {string} [options.routes.prefix=null] - Set module specific actions prefix
 */

const sanitizeRoute = route => {
  const sanitized = String(route || '')
    .replace(/[\\]+/g, '/')
    .replace(/^[/\\]/, '')
    .replace(/[/\\]$/, '');
  
  return sanitized.split('/').map(changeCase.paramCase).join('/').toLowerCase();
};

/**
 * Plugin handler
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} opts - Additional options
 * @param {function(): void} next - Function to continue fastify lifecycle
 */
module.exports = fp(async ( fastify, opts, next ) => {
  /**
   * Modules absolute directory path
   * @type {string} */
  const MODULES_BASE_PATH = Path.normalize(`${__dirname}/../../../modules`);
  
  /**
   * @private
   * @static
   * Get url route from module file path
   * @param {string} filePath - Absolute file path
   * @return {string}
   */
  const pathToModuleRoute = filePath => {
    return String(filePath || '')
      .replace(MODULES_BASE_PATH, '')
      .replace('module.js', '');
  };
  
  const loadModule = async config => {
    /**
     * Modules' list
     * @type {Array<string>} */
    const controllers = glob.sync(`${Path.normalize(config.controllersPath)}/*.controller.js`);
    
    if ( !controllers.length ) {
      return void 0;
    }
    
    for await ( let controllerFile of controllers ) {
      /** @type {string} */
      const controllerRoute = sanitizeRoute(path.basename(controllerFile, '.controller.js'));
      config.controllerRoute = controllerRoute;
      config.route = `/${config.route}/${controllerRoute}`;
      
      await loadController(controllerFile, config);
    }
  };
  
  const loadController = async ( file, config ) => {
    const actionsConfig = await require(file)(fastify);
    
    if ( !R_is(Object, actionsConfig) ) {
      return void 0;
    }
    
    /** @type {import('object-path').ObjectPathBound<Object>} */
    const routeAccessor = op(op.get(config, 'options.routes', {
      prefix: null,
    }));
    
    const controllerConfig = {
      route: config.controllerRoute,
      ...('config' in actionsConfig ? actionsConfig.config : {}),
    };
    
    for await ( const [name, callback] of Object.entries(actionsConfig) ) {
      if ( !name.startsWith('action') ) {
        continue;
      }
      
      /** @type {Array<string>} */
      const urlMap = [];
      
      /** @type {string} */
      const routePrefix = sanitizeRoute(String(routeAccessor.get('prefix') || '').trim());
      routePrefix && urlMap.push(routePrefix);
      
      const routeConfig = await callback(config);
      
      urlMap.push(config.moduleRoute);
      
      controllerConfig.route = sanitizeRoute(controllerConfig.route || config.controllerRoute).trim();
      
      if ( !['', 'default'].includes(controllerConfig.route) ) {
        urlMap.push(controllerConfig.route);
      }
      
      let actionRoute = sanitizeRoute(name.replace(/^action/, '')).trim();
      
      if ( actionRoute !== 'index' ) {
        urlMap.push(sanitizeRoute(actionRoute));
      }
      
      const url = String(routeConfig.url || '').trim();
      url && urlMap.push(url.replace(/^[\/]+/g, ''));
      
      routeConfig.url = `/${urlMap.join('/')}`;
      
      fastify.route(routeConfig);
    }
  };
  
  /**
   * Modules' list
   * @type {Array<string>} */
  const moduleList = glob.sync(`${MODULES_BASE_PATH}/**/module.js`);
  
  try {
    for await ( const file of moduleList ) {
      const filePath = Path.normalize(file);
      const config = require(filePath);
      
      //<editor-fold desc="onInit handler">
      const initCallback = op.get(config, 'onInit');
      
      if ( typeof initCallback === 'function' ) {
        await initCallback(fastify);
      }
      //</editor-fold>
      
      const moduleConfig = {
        controllersPath: '',
        route: pathToModuleRoute(filePath),
        ...config,
        options: {
          ...config.options,
        },
      };
      
      moduleConfig.moduleRoute = sanitizeRoute(moduleConfig.route);
      
      await loadModule(moduleConfig);
    }
  } catch ( err ) {
    throw err;
  }
  
  next();
}, {
  name: 'fastify-modules',
});
