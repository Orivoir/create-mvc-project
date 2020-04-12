const pathResolver = require('path') ;

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

    const routes = [] ;

    annotations.controller.items.forEach( controllerFile => {

        const methodsFile = annotations.controller[ controllerFile ].methods ;

        let basePath = "" ;

        Object.keys( methodsFile ).forEach( controllerName => {

            if(
                annotations.controller[ controllerFile ][ controllerName ] &&
                annotations.controller[ controllerFile ][ controllerName ].data &&
                annotations.controller[ controllerFile ][ controllerName ].data.Controller &&
                typeof annotations.controller[ controllerFile ][ controllerName ].data.Controller.value === "object"
            ) {
                const basePathController = annotations.controller[ controllerFile ][ controllerName ].data.Controller.value.path ;

                if( typeof basePathController === "string" ) {

                    basePath = basePathController ;
                }
            }

            const methodsController = methodsFile[ controllerName ] ;

            const filterRoutesAnnotations = methodsController.getWidth('Route') ;

            let ControllerObject = null ;

            try {

                ControllerObject = require(`./../src/controller/${controllerName}`) ;
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

    } ) ;

    return routes ;
} ;
