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
	fs = require('fs') ,
	pathResolver = require('path')
;

const annotations = new ClassAnnotation('./src/controller/') ;

const routes = buildRoutes( annotations ) ;

const controllers = buildController( router , routes ) ;

fs.writeFile(
	pathResolver.join( __dirname , '/mvc-vendor/routes.json' ) ,

	// persist  only not circular structur JSON routes
	JSON.stringify( routes.map( route => {
			delete route.ControllerObejct ;

			return route ;
		} )
	) ,
	function( err ) {

		if( err ) {

			throw "cant debug router" ;
		}
	}
) ;

router.set('view engine','ejs') ;

router
    .use( '/public' , express.static( 'public' ) )
;


// const httpListener = server.listen( process.env.PORT || 3000 , () => {

    // console.log("http server running") ;

// } ) ;
