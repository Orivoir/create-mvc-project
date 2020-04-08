const args = process.argv.slice( 2 , ) ;

const firstArg = args[0] ;

const colorLog = require('chalk') ;
const fs = require('fs') ;
const pathResolver = require('path') ;

if( /^route(s|r)?$/i.test( firstArg ) ) {

    // log routes create

	const buildRoutes = require('./../mvc-vendor/build-routes') ;
	
	const ClassAnnotation = require('class-annotations')( 
		pathResolver.join( __dirname , './../' )
	) ;
	
	
	const annotations = new ClassAnnotation('./src/controller/') ;
	
	const routes = buildRoutes( annotations ) ; 
	
	fs.writeFile(
		pathResolver.join( __dirname , './../mvc-vendor/routes.json' ) ,
		
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
			
					
			const routeJSON = require('./../mvc-vendor/routes.json') ;
			
			console.log( routeJSON ) ;
		}
	) ;


} else if( /^controller$/.test( firstArg ) ) {

    let controllerName = args[1] ;

    if(
        !!controllerName &&
        /^[a-z]{1}[a-z\d\_\-]{0,254}$/i.test( controllerName )
    ) {

        controllerName = controllerName.trim() ;

        const pathController = pathResolver.join(
            __dirname , './../src/controller' , ( controllerName + ".js" )
        ) ;

        if( fs.existsSync( pathController ) ) {

            console.log(
                colorLog.red.bold(
                    `"${controllerName}" , already exists in: ./src/controller`
                )
            ) ;

            process.exit() ;

        } else {

            console.log(
                colorLog.cyan.bold(
                    `append: ${controllerName}`
                )
            ) ;

            let controllerModel = fs.readFileSync(
                pathResolver.join(
                    __dirname , './../mvc-vendor/controller-model'
                ) ,
                'utf-8'
            ) ;

            while( controllerModel.indexOf('<CONTROLLER_NAME>') !== -1 ) {

                controllerModel = controllerModel.replace(
                    '<CONTROLLER_NAME>' ,
                    controllerName
                ) ;
            }

            while( controllerModel.indexOf('<CONTROLLER_NAME|lower>') !== -1 ) {

                controllerModel = controllerModel.replace(
                    '<CONTROLLER_NAME|lower>' ,
                    controllerName.toLocaleLowerCase()
                ) ;
            }

            fs.appendFileSync(
                pathController ,
                controllerModel ,
                "utf-8"
            ) ;

            console.log(
                colorLog.green.bold(
                    `\ncontroller has been created: "./src/controller/${controllerName}.js"`
                )
            ) ;
        }

    } else {

        console.log(
            colorLog.red.bold(
                `"${controllerName}" , is not a valid controller name`
            )
        ) ;

        process.exit() ;
    }
}

// controller Stuff
    // <- /src/controller/Stuff.js
    // <- views/stuff/