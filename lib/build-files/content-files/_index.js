/**
 * entry point of your MVC project
 */

require('./mvc-vendor/read-envfile') ;

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

let isDev = false ;

// only dev dependencies
let colorLog = null ;

if( /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ) {

	// load dev dependencies
	colorLog = require('chalk') ;

	isDev = true ;

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

		if( isDev ) {

			console.log( colorLog.cyan.bold( startMessage ) ) ;

		} else {

			console.log( startMessage ) ;
		}

	} ) ;
} ;

startHTTP() ;
