const { buildLogCli } = require('./../../mvc-vendor/logger') ;

const pathResolver = require('path') ;

const fs = require('fs') ;

const errConnect = (err,config) => {

    if( err.code === "ECONNREFUSED" ) {

        console.log(`${buildLogCli('Error', 'red', 'bold' )}: connection refused with: ${config.host}`) ;
    } else {

        throw err;
    }

    process.exit( 1 ) ;

} ;

module.exports = function( args ) {

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

	} else if( /^(export|dump|snap(shoo?t)?)|back\-?up$/i.test( handlerCommand ) ) {

		// https://www.npmjs.com/package/mysqldump

		const mysqldump = require('mysqldump') ;

		if( !fs.existsSync( pathResolver.resolve( __dirname, "./../../SQL/" ) ) ) {

			fs.mkdirSync( pathResolver.resolve( __dirname, "./../../SQL/" ) ) ;
			console.log( "append folder: './SQL/'" ) ;
		}

		mysqldump( {

			connection: {
				host: config.host,
				user: config.user,
				password: config.password,
				database: config.database
			},

			dumpToFile: `${pathResolver.resolve( __dirname , './../../SQL/' , ( config.database + ".sql" ) )}`
		} )
		.then( () => {

			console.log( `append: "${buildLogCli(config.database + ".sql", "green")}" from "${buildLogCli("./SQL/"+config.database+".sql", "green")}"`) ;

		} )
		.catch( error => {

			if( error.code === "ER_EMPTY_QUERY" ) {

				console.log( buildLogCli('ERROR:', "red","bold") + " your database is empty cannot export empty database as SQL file" ) ;

				process.exit( 1 )

			} else {
				throw error ;
			}

		} ) ;


	} else if( /^import$/i.test( handlerCommand ) ) {

		const mysqlimport = require('mysql-import') ;

		const importer = new mysqlimport({

			host: config.host,
			user: config.user,
			password: config.password,
			database: config.database
		}) ;

		importer.import(
			pathResolver.resolve( __dirname , `./../../SQL/${config.database}.sql` )

		).then( () => {

			const file = importer.getImported() ;

			console.log(`${file.length} SQL file has been imported from "./SQL/${config.database}.sql"`) ;

		} ).catch( err => {

			if( err.code === "ER_BAD_DB_ERROR" ) {

				console.log( buildLogCli('Error' , 'red', 'bold' ) + `: cant import SQL file to database not exists\n\ntry > node ./bin/console mysql create` ) ;

				process.exit( 1 ) ;

			} else if( err.code === "ENOENT" ) {


				console.log( buildLogCli('Error' , 'red', 'bold' ) + `: SQL file from : "./SQL/${config.database}.sql" not exists should run > node ./bin/console mysql dump for export sql file` ) ;

				process.exit( 1 ) ;

			} else {


				throw err ;
			}
		} ) ;

	} else {

		console.log( `${buildLogCli('Error', 'red','bold')}: "${handlerCommand}" is not valid MySQL command` ) ;

		process.exit( 1 ) ;
	}

} ;
