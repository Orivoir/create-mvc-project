const routes = [] ;

const isConflictRoutes = require('./resolve-conflict-routes') ;

const readOneFile = require('./read-file-item') ;

const readOneDirectory = require('./read-directory-item') ;

module.exports = function( annotations ) {

    if( typeof annotations !== "object" || !annotations ) {

        throw RangeError('arg1: annotations controller should be a object') ;
    }

    if(
        !annotations.controller ||
        !annotations.controller.items
    ) {
        // have not defined routes
        return [] ;
    }

    annotations.controller.items.forEach( controllerFile => {

		if( !annotations.controller[ controllerFile ] ) {
			return;
		}

		if( /directory/i.test(
			annotations.controller[ controllerFile ].constructor.name )
		) {

			const subdirectory = annotations.controller[ controllerFile ] ;

			readOneDirectory( subdirectory, routes ) ;

		} else {

			readOneFile(
				annotations.controller[ controllerFile ] ,
				routes
			) ;
		}

	} ) ;

	if( isConflictRoutes( routes ) ) {

		const message = `Error: route define have conflict duplicate of: path, Controller.method or name` ;

		if( /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ) {

			const colorLog = require('chalk') ;

			console.log( colorLog.red.bold( message ) ) ;
		} else {

			console.log( message );
		}

		process.exit() ;

	} else {

		return routes ;
	}
} ;
