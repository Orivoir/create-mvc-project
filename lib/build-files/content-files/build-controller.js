module.exports = function( router , routes  , dependencies ) {

	const controllers = {} ;

	const createRoute = ({
		method,
		url,
		controllerName,
		methodName,
		ControllerObject
	}) => {

		if( !controllers[ controllerName ] ) {

			const dependence = dependencies.find( d => d.controller === controllerName ) ;

			const args = [] ;

			dependence.list.forEach( _package => {

				try {

					args.push ( require( _package.replace('Package','') ) ) ;
				} catch( e ) {

					if( e.code === "MODULE_NOT_FOUND" )  {

						const message = `dependacies "${_package.replace('Package','')}" , not found for controller: ${controllerName}\n` ;

						if( /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ) {

							const colorLog = require('chalk') ;

							console.log( colorLog.red.bold( message ) ) ;

						} else {


							console.log( message ) ;
						}

						process.exit() ;
					}
					else {

						throw e ;
					}

				}
			} ) ;

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
