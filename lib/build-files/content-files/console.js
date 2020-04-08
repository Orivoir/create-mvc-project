#!/usr/bin/env node

const args = process.argv.slice( 2 , ) ;

const firstArg = args[0] ;

const colorLog = require('chalk') ;
const fs = require('fs') ;
const pathResolver = require('path') ;

if( /^route(s|r)?$/i.test( firstArg ) ) {

    // log routes create

	const buildRoutes = require('./../mvc-vendor/build-routes') ;
	const writeFiles = require('./../mvc-vendor/write-routes') ;

	const ClassAnnotation = require('class-annotations')(
		pathResolver.join( __dirname , './../' )
	) ;


	const annotations = new ClassAnnotation('./src/controller/') ;

	const routes = buildRoutes( annotations ) ;

    writeFiles( routes , routesJSON => {

        console.log( colorLog.yellow.bold( '\n========== DEBUG ROUTER ==========>\n\n') );

        routesJSON.forEach( route => {

            console.log(
                colorLog.yellow.bold( route.method ) + "\t" +
                colorLog.green.bold( '"'+route.path+'"' ) + "\t" +
                colorLog.white.bold( route.controller ) + "." + colorLog.yellow.bold ( route.name ) + "\n"

            );

        } ) ;

        console.log( "\n" ) ;
    } )



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