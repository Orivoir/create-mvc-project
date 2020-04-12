#!/usr/bin/env node

const args = process.argv.slice( 2, ) ;

const firstArg = args[0] ;

const colorLog = require('chalk') ;
const fs = require('fs') ;
const pathResolver = require('path') ;

const isDev = /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ;

if( /^route(s|r)?$/i.test( firstArg ) ) {

    // log routes create

    let controllerName = args[ 1 ] ;

	if( typeof controllerName === "string" ) {

		controllerName = controllerName.trim() ;
	}

	const buildRoutes = require('./../mvc-vendor/build-routes') ;
	const writeFiles = require('./../mvc-vendor/write-routes') ;

	const ClassAnnotation = require('class-annotations')(
		pathResolver.join( __dirname , './../' )
	) ;

	const annotations = new ClassAnnotation('./src/controller/') ;

	const routes = buildRoutes( annotations ) ;

    writeFiles( routes , routesJSON => {

        console.log( colorLog.yellow.bold( '\n\n\t========== DEBUG ROUTER ==========\n\n') );

		const cliui = require('cliui')() ;

		cliui.div(
			{
				text: colorLog.yellow.bold( 'method' ) ,
				width: 20 ,
				padding: [2,0,0,2]
			} ,{
				text: colorLog.yellow.bold( 'path' ) ,
				width: 20,
				padding: [2,0,0,2]
			} ,{
				text: colorLog.yellow.bold( 'controller' ) ,
				width: 20,
				padding: [2,0,0,2]
			}
		) ;

		cliui.div( {
			text: colorLog.yellow.bold('-------------------------------------------------------'),
			width: 60 + ( 2 * 3 ) ,
			padding: [1,0,2,2]
		} ) ;

        const isSpecificController = typeof controllerName === "string" && !!controllerName.length ;

        routesJSON.forEach( route => {

            if(
                isSpecificController &&
                route.controller === controllerName ||
				!isSpecificController
            ) {
                cliui.div(
                    {
                        text: colorLog.yellow.bold( route.methods.join(', ') ) ,
                        width: 20 ,
                        padding: [2,0,0,2]
                    },{
                        text: colorLog.green.bold( '"'+route.path+'"' ) ,
                        width: 20 ,
                        padding: [2,0,0,2]
                    },{
                        text: colorLog.yellow.bold( route.controller ) + "." + colorLog.white.bold( route.methodName ) ,
                        width: 20 ,
                        padding: [2,0,0,2]
                    }
                )
            }

        } ) ;

		console.log( cliui.toString() ) ;

        console.log( "\n" ) ;
    } )


} else if( /^controller$/i.test( firstArg ) ) {

    let controllerName = args[1] ;

    const buildModelController = require('./../mvc-vendor/build-model-controller') ;
    const buildViewController = require('./../mvc-vendor/build-view-controller') ;

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

            const isJsonController = ( typeof args[2] === "string" &&
                    /^(\-\-?)(json|api|no\-?(template|tpl))$/i.test(args[2].trim())
            ) ;

            let controllerModel = fs.readFileSync(
                pathResolver.join(
                    __dirname , `./../mvc-vendor/controller-model-${isJsonController ? "json":"template"}`
                ) ,
                'utf-8'
            ) ;

            controllerModel = buildModelController( controllerModel,controllerName ) ;

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

            if( !isJsonController ) {

                buildViewController( controllerName ) ;
            } else {

                console.log(
                    colorLog.green(
                        `\nJSON controller has been created with success\n`
                    )
                ) ;
            }
        }

    } else {

        console.log(
            colorLog.red.bold(
                `"${controllerName}" , is not a valid controller name`
            )
        ) ;

        process.exit() ;
    }
} else if( /^mysql$/i.test( firstArg ) ) {

    require('./../mvc-vendor/read-envfile') ;

    const setupMysql = require('./../mvc-vendor/setup-mysql') ;

    setupMysql({

        onNotConfig: function() {

            console.log( colorLog.red.bold(
                `MySQL config not found check your .env file `
            ) ) ;
        } ,
        onTryMysql: function( result ) {

            console.log( colorLog.green.bold( `\nGet version MySQL success\n`) ) ;

            console.log( result[0] ) ;

            console.log( colorLog.yellow.bold( `\ninject dependence as: "dao" or "mysql" from any contructor of a controller\n`) ) ;

            process.exit() ;
        }
    }) ;

} else if( /^env$/i.test( firstArg ) ) {


    require('./../mvc-vendor/read-envfile') ;

    const CMP_ENV = process['create-mvc-project-env'] ;

    console.log('your config project:\n') ;

    Object
        .keys( CMP_ENV )
        .forEach( attr => {

            console.log( `\n${attr} = ${CMP_ENV[attr]}` )

        } )
    ;

    process.exit() ;

} else {

    // should show commands list
}
