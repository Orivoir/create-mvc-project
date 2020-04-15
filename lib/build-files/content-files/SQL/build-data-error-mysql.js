module.exports = function({
    config,
    isDatabaseUrlAuthentication
}) {

    if( isDatabaseUrlAuthentication ) {

        const parserDatabaseUrl = require('parse-database-url') ;

        return parserDatabaseUrl( process.env.DATABASE_URL ) ;

    } else {

        return config ;

    }

} ;
