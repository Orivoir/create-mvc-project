/**
 * entry point of your MVC project
 */

require('./mvc-vendor/read-envfile') ;

process['create-mvc-project'] = {

	isDev: /^dev(elopment)?$/i.test( process.env.NODE_ENV )
} ;

const paramInstall = require('./mvc-vendor/storage-install.json') ;

process.env.DOC_URL = "https://github.com/orivoir/create-mvc-project" ;

const CMP = process['create-mvc-project'] ;
const executeEntryPoint = require('./mvc-vendor/execute-custom-entry-point') ;

let setupMysql = null ;

if( !paramInstall.find( arg => /^no\-(my)?sql$/.test( arg ) ) ) {

	setupMysql = require('./mvc-vendor/setup-mysql') ;
}

// only dev dependencies
let colorLog = null ;

if( CMP.isDev ) {

	// load dev dependencies
	colorLog = require('chalk') ;

	console.log( colorLog.cyan.bold("\nstart in development mode\n") ) ;
	process.env.PORT = 3000 ;
}


setupMysql instanceof Function ?
setupMysql( {
	onGetDAO: function(dao) {

		process['create-mvc-project'].dao = dao ;
	}
} ) : null ;

const
	buildController = require('./mvc-vendor/build-controller') ,
	buildRoutes = require('./mvc-vendor/build-routes') ,
	ClassAnnotation = require('class-annotations')( __dirname ) ,
	writeRoutes = require('./mvc-vendor/write-routes') ,
	resolveDependenciesController = require('./mvc-vendor/resolve-dependencies-controller') ,
	pathResolver = require('path') ,
	fs = require('fs')
;

let router = null ;
if(
	!fs.existsSync(
		pathResolver.join(
			__dirname ,
			'/config/express.config.js'
		)
	)
) {
	console.log('missing: config express file in : ./config/express.config.js') ;
	process.exit() ;

} else {

	const {express,config} = require('./config/express.config') ;

	if( express instanceof Function ) {

		router = express() ;

		if( typeof process.env.ENTRY_POINT_FIRST_TIME === "string" ) {

			const isFound = executeEntryPoint({
				pathFile: process.env.ENTRY_POINT_FIRST_TIME.trim(),
				args: [ express, process['create-mvc-project'] ]
			} ) ;

			if( !isFound ) {

				const message = `entry point to execute before server HTTP running not foun from: "${process.env.ENTRY_POINT_FIRST_TIME}", check your "./.env" file` ;

				if( colorLog ) {

					console.log(
						colorLog.red.bold( message )
					) ;
				} else {

					console.log( message ) ;
				}

				process.exit() ;
			}
		}

	} else {

		console.log('requirement: `config.express.js` , should be return, express') ;
		process.exit() ;
	}

	const affectConfigExpress = require('./mvc-vendor/affect-config-express') ;

	affectConfigExpress( router, config ) ;
}

const server = require('http').Server( router ) ;

const annotations = new ClassAnnotation('./src/controller/') ;

const routes = buildRoutes( annotations ) ;

const dependencies = resolveDependenciesController( annotations ) ;

const controllers = buildController( router , routes , dependencies ) ;

writeRoutes( routes ) ;

router.use( function( request, response,next ) {

	// catch 404

	const path404 = pathResolver.join(
		__dirname ,
		`/mvc-vendor/${request.url === "/" && /^dev(elopment)?$/i.test(process.env.NODE_ENV) ? "home-":""}404.html`
	) ;

	response.status( 404 ) ;

	response.type('html') ;

	response.sendFile( path404 ) ;

} ) ;

const startHTTP = function() {

	const httpListener = server.listen( process.env.PORT, () => {

		const addr = httpListener.address() ;

		const startMessage = `\nApp running go check: http://127.0.0.1:${addr.port}/` ;

		if( CMP.isDev ) {

			console.log( colorLog.cyan.bold( startMessage ) ) ;

		} else {

			console.log( startMessage ) ;
		}

		if( typeof process.env.ENTRY_POINT === "string" ) {

			const isFound = executeEntryPoint({
				pathFile: process.env.ENTRY_POINT.trim(),
				args: [ httpListener, server, router ]
			} ) ;

			if( !isFound ) {

				const message = `error: entry point file define from .env not found with: ${process.env.ENTRY_POINT}` ;

				if( CMP.isDev ) {


					console.log( colorLog.red.bold( message ) ) ;

				} else {

					console.log( message ) ;
				}

				process.exit() ;

			}

		}

	} ) ;
} ;

startHTTP() ;
