// ECONNREFUSED => not found mysql ( mysql is offline , port is invalid )
// ER_ACCESS_DENIED_ERROR | ER_DBACCESS_DENIED_ERROR => credentials authentication error
// ER_BAD_DB_ERROR => not exists db
// ENOTFOUND => host error


module.exports = function( {
    config,
    isDatabaseUrlAuthentication,
    error
} ) {

    const {code} = error ;

    console.log( code ) ;

    const dataError = require('./build-data-error-mysql')( {
        config,
        isDatabaseUrlAuthentication
    } ) ;

    const associateError = {
        "ECONNREFUSED": "mysql is offline or port is invalid",
        "ER_ACCESS_DENIED_ERROR": `credentials authentication invalid with: ( "${dataError.user}", "${dataError.password}" )`,
        "ER_DBACCESS_DENIED_ERROR": `credentials authentication invalid with: ( "${dataError.user}", "${dataError.password}" )`,
        "ER_BAD_DB_ERROR": `not found database: "${dataError.database}"`,
        "ENOTFOUND": `hostname error with: "${dataError.host}"`
    } ;

    const message = "MySQL Error: " ;

    if( associateError[code] ) {

        console.log( message + associateError[code] ) ;

    } else {

        // unknow error
        throw error ;
    }

    process.exit() ;
} ;


