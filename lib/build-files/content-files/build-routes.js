const pathResolver = require('path') ;
const routes = [] ;

const isConflictRoutes = require('./resolve-conflict-routes') ;

const readOneFile = (
	methodsFile,
	phisycalPathFile,
	item
) => {

	// accept only a controller by file
	const controllerAnnotation = item[ item.items[0] ] ;

	let basePath = "" ;

	if (
		controllerAnnotation.data &&
		controllerAnnotation.data.Controller &&
		typeof controllerAnnotation.data.Controller.value === "object"
	){

		const defineController = controllerAnnotation.data.Controller.value ;

		if( typeof defineController.path === "string" ) {

			basePath = defineController.path ;
		}
	}

	if( !/\.js$/.test( phisycalPathFile ) ) {
		return;
	}

	Object.keys( methodsFile ).forEach( controllerName => {

		const methodsController = methodsFile[ controllerName ] ;

		const filterRoutesAnnotations = methodsController.getWidth('Route') ;

		let ControllerObject = null ;

		try {

			ControllerObject = require( phisycalPathFile ) ;
		} catch( e ) {

			if( e.code === "MODULE_NOT_FOUND" ) {

				console.log( `controller from: "./src/controller/${controllerName}.js" not found` ) ;
			} else {

				throw e ;
			}

			process.exit( 1 ) ;
		}

		filterRoutesAnnotations.forEach( route => {

			const data = route.value ;

			routes.push( {
				name: data.name ,
				controller: route.classname,
				methods: data.methods ,
				methodName: route.method,
				path: pathResolver.join( basePath, data.path ).split('\\').join('/'),
				ControllerObject: ControllerObject
			} ) ;

		} ) ;

	} ) ;

} ;

const readOneDirectory = ( directory, annotations ) => {

	const items = directory.items ;

	items.forEach( item => {

		const objectItem = directory[ item ] ;

		if( /classannotation/i.test( objectItem.constructor.name ) ) {

			readOneFile(
				objectItem.methods,
				objectItem.pathFile,
				objectItem
			) ;

		} else {
			readOneDirectory( objectItem, annotations ) ;
		}

	} ) ;
} ;

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

		if( /directory/i.test( annotations.controller[ controllerFile ].constructor.name ) ) {

			const subdirectory = annotations.controller[ controllerFile ] ;

			readOneDirectory( subdirectory, annotations ) ;

		} else {

			const methodsFile = annotations.controller[ controllerFile ].methods ;

			readOneFile(
				methodsFile,
				annotations.controller[ controllerFile ].pathFile,
				annotations.controller[ controllerFile ]
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
