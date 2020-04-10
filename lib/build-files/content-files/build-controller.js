const injectorDependencies = require('./injector-dependence') ;

module.exports = function(
	router,
	routes,
	dependencies
) {

	const controllers = {} ;

	const createRoute = ( {
		method,
		url,
		controllerName,
		methodName,
		ControllerObject
	} ) => {

		if( !controllers[ controllerName ] ) {

			const args = injectorDependencies( dependencies , controllerName ) ;

			controllers[ controllerName ] = new ControllerObject( ...args ) ;
		}

		if( router[ method ] instanceof Function ) {

			router[ method ]( url, controllers[ controllerName ][ methodName ] ) ;
		}

	} ;

	routes.forEach( route => {

		if( route.method instanceof Array ) {

			route.method.forEach( method => {

				createRoute({
					controllerName: route.controller,
					methodName: route.name,
					method: method.toLocaleLowerCase(),
					ControllerObject: route.ControllerObject,
					url: route.path
				}) ;

			} ) ;


		} else {

			createRoute({
				controllerName: route.controller,
				methodName: route.name,
				method: route.method.toLocaleLowerCase(),
				ControllerObject: route.ControllerObject,
				url: route.path
			}) ;
		}

	} ) ;

	return controllers ;
} ;
