const i18n = require('i18n');
const log4js = require('log4js');
const logger = log4js.getLogger('app');

i18n.configure({
    locales: ['en', 'es'],
    directory: __dirname + '/locales',
    defaultLocale: 'es',
    cookie: 'lang',
    
    // will return translation from defaultLocale in case current locale doesn't provide it
    retryInDefaultLocale: false,

    // sets a custom header name to read the language preference from - accept-language header by default
    header: 'accept-language',

    // watch for changes in JSON files to reload locale on updates - defaults to false
    autoReload: true,

    // whether to write new locale information to disk - defaults to true
    updateFiles: true,

    // sync locale information across all files - defaults to false
    syncFiles: true,

    objectNotation: true,
    
    logErrorFn: function (msg) {
        logger.error('i18n', {message: msg});
    },
});

module.exports = i18n;