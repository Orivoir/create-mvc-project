const pathResolver = require('path') ;

module.exports = function( item, routes ) {

	// accept only a controller by file
	const controllerAnnotation = item.items instanceof Array ? item[ item.items[0] ]: null;

	let basePath = "" ;

	// resolve base path
	if (
		controllerAnnotation &&
		controllerAnnotation.data &&
		controllerAnnotation.data.Controller &&
		typeof controllerAnnotation.data.Controller.value === "object"
	){

		const defineController = controllerAnnotation.data.Controller.value ;

		if( typeof defineController.path === "string" ) {

			basePath = defineController.path ;
		}
	}

	const methodsFile = item.methods ;
	const phisycalPathFile = item.pathFile ;

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
