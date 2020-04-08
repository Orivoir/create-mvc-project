/**
 * entry point of your MVC project
 */

require('./mvc-vendor/read-envfile') ;

const
    express = require('express') ,
    router = express() ,
	server = require('http').Server( router ) ,
	buildController = require('./mvc-vendor/build-controller') ,
	buildRoutes = require('./mvc-vendor/build-routes') ,
	ClassAnnotation = require('class-annotations')( __dirname ) ,
	writeRoutes = require('./mvc-vendor/write-routes')
;


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

const annotations = new ClassAnnotation('./src/controller/') ;

const routes = buildRoutes( annotations ) ;

const controllers = buildController( router , routes ) ;

writeRoutes( routes ) ;

router.set('view engine','ejs') ;

router
    .use( '/public' , express.static( 'public' ) )
;

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
