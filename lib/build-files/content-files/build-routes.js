module.exports = function( annotations ) {

    const routes = [] ;

    annotations.controller.items.forEach( controllerFile => {

        annotations.controller[controllerFile].items.forEach( controllerClass => {

            const controllerAnnotation = annotations.controller[controllerFile][ controllerClass ] ;

            let url = "" ;

            const classname = controllerClass ;

            const pathRequire = `./../src/controller/${classname}`;

            const ControllerObject = require( pathRequire ) ;

            if (
                controllerAnnotation &&
                controllerAnnotation.data.Controller &&
                typeof controllerAnnotation.data.Controller.value === "object" &&
                typeof controllerAnnotation.data.Controller.value.path === "string"
            ) {

                url = controllerAnnotation.data.Controller.value.path ;
            }

            Object
                .keys( annotations.controller[controllerFile].methods )
                .forEach( classnameMethod => {

                    const methods = annotations.controller[controllerFile].methods[classnameMethod ] ;

                    if ( classnameMethod === classname ) {

                        methods.forEach( method => {

                            if (
                                !!method.data.Route &&
                                typeof method.data.Route.value === "object"
                            ) {

                                const route = method.data.Route.value ;

                                let methods = route.methods ;

                                if( methods instanceof Array ) {

                                    methods.forEach( method => {

                                        routes.push( {
											name: route.name ,
                                            controller: classname,
                                            method: [ method ] ,
                                            path: ( url + route.path ) ,
                                            ControllerObject: ControllerObject
                                        } ) ;

                                    } ) ;

                                } else if( typeof methods === "string" ) {

                                    routes.push( {
										name: route.name ,
                                        controller: classname,
                                        method: [ method ] ,
                                        path: (url + route.path ) ,
                                        ControllerObject: ControllerObject
                                    } ) ;
                                }

                            }

                        } ) ;
                    }

                } )
            ;

        } ) ;

    } ) ;

    return routes ;
} ;
