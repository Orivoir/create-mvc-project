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

			if( controllers[ controllerName ][ methodName ] instanceof Function ) {

				router[ method ]( url, function() {

					controllers[ controllerName ][ methodName ]( ...[...arguments] ) ;

				} ) ;
			}
			else {

				const message = `Error: method controller should be a function from: ./src/controller/${controllerName}.js\nmethod: "${methodName}" , should be an function but its a: "${typeof controllers[ controllerName ][ methodName ]}"\nplease go read docs: ${process.env.DOC_URL}#controller` ;

				if( process['create-mvc-project'].isDev ) {

					const colorLog = require('chalk') ;

					console.log(
						colorLog.red.bold( message )
					) ;
				} else {

					console.log( message ) ;
				}

				process.exit() ;
			}
		}

	} ;

	routes.forEach( route => {

		if( route.methods instanceof Array ) {

			route.methods.forEach( method => {

				createRoute( {
					controllerName: route.controller,
					methodName: route.methodName,
					method: method.toLocaleLowerCase(),
					ControllerObject: route.ControllerObject,
					url: route.path
				} ) ;

			} ) ;
		}

	} ) ;

	return controllers ;
} ;
