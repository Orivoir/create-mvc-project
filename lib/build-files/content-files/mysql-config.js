module.exports = function( config , callback = null ) {

    try {

        const mysql = require('mysql') ;

        let conn = null ;

        if( typeof process.env.DATABASE_URL === "string" ) {

            conn = mysql.createConnection( process.env.DATABASE_URL ) ;

        } else {

            let connectTimeout = null ;

            if( /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ) {

                connectTimeout = 8e3 ; // 8 seconds in dev
            } else {

                connectTimeout = 3e4 ; // 30seconds in prod or test
            }

            conn = mysql.createConnection({
                ...config,
                connectTimeout
            } ) ;

        }

        // check status MySQL
		conn.query('SELECT version()' , (error,result) => {

			// ECONNREFUSED => not found mysql ( mysql is offline , port is invalid )
			// ER_ACCESS_DENIED_ERROR | ER_DBACCESS_DENIED_ERROR => credentials authentication error
			// ER_BAD_DB_ERROR => not exists db
			// ENOTFOUND => host error

			if( !error ) {

                callback instanceof Function ? callback( result ): null;

                return;
            } ;

			const {code} = error ;

			console.log( code ) ;

			const message = "MySQL Error: " ;

			const associateError = {
				"ECONNREFUSED": "mysql is offline or port is invalid",
				"ER_ACCESS_DENIED_ERROR": `credentials authentication invalid with: ( "${config.user}", "${config.password}" )`,
				"ER_DBACCESS_DENIED_ERROR": `credentials authentication invalid with: ( "${config.user}", "${config.password}" )`,
				"ER_BAD_DB_ERROR": `not found database: "${config.database}"`,
				"ENOTFOUND": `hostname error with: "${config.host}"`
			} ;

			if( associateError[code] ) {

				console.log( message + associateError[code] ) ;

			} else {

				// unknow error
				throw error ;
			}

			process.exit() ;

		} ) ;

		return conn ;

    } catch( e ) {

        if( e.code === "MODULE_NOT_FOUND" ) {

            const message = `\nMysql Error: you have define config mysql but module not found.\n> npm install mysql --save\n> npm start` ;

            if( process['create-mvc-project'] && process['create-mvc-project'].isDev ) {

                const colorLog = require('chalk') ;

                console.log(
                    colorLog.red.bold(
                        message
                    )
                )

            } else {
                console.log( message ) ;
            }

            process.exit() ;
        }
    }

} ;
