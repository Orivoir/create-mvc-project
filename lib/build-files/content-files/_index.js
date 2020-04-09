/**
 * entry point of your MVC project
 */

require('./mvc-vendor/read-envfile') ;

process['create-mvc-project'] = {

	isDev: /^dev(elopment)?$/i.test( process.env.NODE_ENV )
} ;

const CMP = process['create-mvc-project'] ;

if (
	typeof process.env.DB_USER === "string" &&
	typeof process.env.DB_PASSWORD === "string" &&
	typeof process.env.DB_NAME === "string" &&
	typeof process.env.DB_PORT === "string" &&
	typeof process.env.DB_HOST === "string"
) {

	const mysql = require('./mvc-vendor/mysql-config') ;

	const dao = mysql({
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
		host: process.env.DB_HOST
	}) ;

	process['create-mvc-project'].dao = dao ;
}

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
	} else {

		console.log('requirement: `config.express.js` , should be return, express') ;
		process.exit() ;
	}

	const affectConfigExpress = require('./mvc-vendor/affect-config-express') ;

	affectConfigExpress( router, config ) ;
}

// only dev dependencies
let colorLog = null ;

if( CMP.isDev ) {

	// load dev dependencies
	colorLog = require('chalk') ;

	console.log( colorLog.cyan.bold("\nstart in development mode\n") ) ;
	process.env.PORT = 3000 ;
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

	} ) ;
} ;

startHTTP() ;
