/**
 * entry point of your MVC project
 */

const
    express = require('express') ,
    router = express() ,
	server = require('http').Server( router ) ,
	buildController = require('./mvc-vendor/build-controller') ,
	buildRoutes = require('./mvc-vendor/build-routes') ,
	ClassAnnotation = require('class-annotations')( __dirname ) ,
	writeRoutes = require('./mvc-vendor/write-routes') ,

	colorLog = require('chalk')
;

const annotations = new ClassAnnotation('./src/controller/') ;

const routes = buildRoutes( annotations ) ;

const controllers = buildController( router , routes ) ;

writeRoutes( routes ) ;

router.set('view engine','ejs') ;

router
    .use( '/public' , express.static( 'public' ) )
;

let currentPort = 3000 ;

const MAX_ATTEMPT = 10 ;

const startHTTP = function() {

	const httpListener = server.listen( process.env.PORT || currentPort , () => {

		const addr = httpListener.address() ;

		console.log(
			colorLog.cyan.bold(`\nApp running go check: http://127.0.0.1:${addr.port}/`)
		) ;

	} ) ;
} ;

startHTTP() ;

server.on('error' , e => {

	if( e.code === 'EADDRINUSE' ) {

		console.log(`Adress: ${currentPort} , already use`) ;

		if( currentPort <= ( currentPort + MAX_ATTEMPT ) ) {

			console.log(`retrying run ...`) ;

			currentPort++ ;
			startHTTP() ;
		} else {

			console.log(`max retrying port and all use .\nplease free an port between: [| 3000 , 3010 |]`) ;
		}
	}

} ) ;
