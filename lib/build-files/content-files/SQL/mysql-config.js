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

			if( !error ) {

                callback instanceof Function ? callback( result ): null;

                return;
            } else {

                const mysqlError = require('./mysql-error') ;

                mysqlError( {
                    config,
                    isDatabaseUrlAuthentication:typeof process.env.DATABASE_URL === "string",
                    error
                } ) ;
            }

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
