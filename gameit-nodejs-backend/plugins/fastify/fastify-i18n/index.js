/**
 * Fastify i18n plugin
 */

const fs = require('fs');
const i18n = require('i18n');
const fp = require('fastify-plugin');

// Utils
const Path = require('./../../../utils/core/path');

/** @type {boolean} */
const i18nDebugMissing = process.env.I18N_DEBUG_MISSING !== 'false' || false;
/** @type {boolean} */
const i18nDebugOther = process.env.I18N_DEBUG_OTHER !== 'false' || false;

/**
 * Translates a single phrase and adds it to locales if unknown. Returns translated parsed and substituted string.
 * @see https://www.npmjs.com/package/i18n#i18n__
 * @name FastifyRequest#t
 * @function
 * @memberof FastifyRequest
 * @param {string|{[string]: *}} phrase The phrase to translate or options for translation
 * @returns {string} The translated phrase
 */

/**
 * Plurals translation of a single phrase. Singular and plural forms will get added to locales if unknown. Returns translated
 * parsed and substituted string based on last count parameter.
 * @see https://www.npmjs.com/package/i18n#i18n__n
 * @name FastifyRequest#tn
 * @function
 * @memberof FastifyRequest
 * @param {string|object<string, string>} singular The phrase to translate or options for translation
 * @param {string|object|number} plural The phrase to translate or options for translation
 * @param {number} count The phrase to translate or options for translation
 * @returns {string} The translated phrase
 */

module.exports = fp(
  /**
   * Fastify I18n
   * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
   * @param {Object} opts - Plugin options
   * @param {function(): void} next - Next function
   * @see https://www.npmjs.com/package/i18n
   */
  async ( fastify, opts, next ) => {
    /**
     * Translations directory (absolute path)
     * @type {string}
     */
    const basePath = Path.normalize(`${__dirname}/../../../locales/`);
    
    let localesPath = fs.existsSync(Path.normalize(`${basePath}/dist/en-US.json`))
      ? Path.normalize(`${basePath}/dist`)
      : Path.normalize(`${basePath}/src`);
    
    // minimal config
    i18n.configure({
      locales: JSON.parse(process.env.I18N_SUPPORTED_LANGUAGES || '[]'),
      defaultLocale: process.env.I18N_DEFAULT_LANGUAGE || 'en-US',
      autoReload: true,
      updateFiles: false,
      directory: localesPath,
      missingKeyFn ( locale, value ) {
        i18nDebugMissing && console.log('[i18n.missingp]:', value, locale);
        return value;
      },
      api: {
        __: 't',  //now req.__ becomes req.t
        __n: 'tn', //and req.__n can be called as req.tn
      },
      logDebugFn ( msg ) {
        i18nDebugOther && console.log('[i18n.debug]:', msg);
      },
  
      logWarnFn ( msg ) {
        i18nDebugOther && console.log('[i18n.warn]:', msg);
      },
  
      logErrorFn ( msg ) {
        i18nDebugOther && console.log('[i18n.error]:', msg);
      },
    });
    
    fastify.addHook('preHandler', i18n.init);
    next();
  }, {
    name: 'fastify-i18n'
  });
