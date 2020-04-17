const { buildLogCli } = require('./../../mvc-vendor/logger') ;

const errConnect = (err,config) => {

    if( err.code === "ECONNREFUSED" ) {

        console.log(`${buildLogCli('Error', 'red', 'bold' )}: connection refused with: ${config.host}`) ;
    } else {

        throw err;
    }

    process.exit( 1 ) ;

} ;

module.exports = function( args ) {

    // > ./bin/console mysql create [charset --optional]
        // <=> append db if not exists default charset utf8

    // > ./bin/console mysql drop
        // <=> drop db if exists

    // > ./bin/console mysql export [path --optional]
        // <=> build and exports SQL file default path ./(MY)?SQL/

    const handlerCommand = args[1].trim().toLowerCase() ;

    // handlerCommand should be ( "create", "drop", "export" )

	const parserDatabaseUrl = require('parse-database-url') ;

	let config = null ;

	if( !!process.env.DATABASE_URL ) {

		config = parserDatabaseUrl( process.env.DATABASE_URL ) ;
	} else {

		config = {
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT
		} ;
	}

	const mysql = require('mysql') ;

	const conn = mysql.createConnection( {
		host: config.host,
		user: config.user,
		password: config.password
	} ) ;

	if( handlerCommand === "create" ) {

		conn.connect( function( err ) {

			if( err ) {

                errConnect( err, config ) ;
			}

			conn.query( `CREATE DATABASE ${config.database}`, function( err, result ) {

				if( err ) {

                    if( err.code === "ER_DB_CREATE_EXISTS" ) {

                        console.log(`${buildLogCli('Error', 'red', 'bold' )}: database: "${config.database}" already exists.`) ;
                    } else {

                        throw err ;
                    }

                    process.exit( 1 ) ;
				}

				console.log(`database: "${buildLogCli(config.database, "green", "bold")}" create with success.`) ;

				process.exit() ;
			} ) ;

		} ) ;

	} else if( handlerCommand === "drop" ) {

        conn.connect( function( err ) {

            if( err ) {

                errConnect( err, config ) ;
            }

            conn.query(`DROP DATABASE ${config.database}`, function(err, result) {

                if( err ) {

                    if( err.code === "ER_DB_DROP_EXISTS" ) {

                        console.log(`${buildLogCli('Error', 'red', 'bold' )}: database: "${config.database}" not exists.`) ;
                    } else {

                        throw err ;
                    }

                    process.exit( 1 ) ;
                }

                console.log(`database: "${buildLogCli( config.database, "green", "bold" )}" have been remove with success`) ;

				process.exit() ;

            } ) ;

        } ) ;

	} else if( handlerCommand === "export" ) {


	} else {


	}

} ;
