#!/usr/bin/env node

/**
 * @author S.GABORIEAU <https://github.com/Orivoir/>
 *
 * @liscence see README.md
 *
 * @summary this file is **CLI** integrate with: `create-mvc-project` \
 * - debug router \
 * - build controller \
 * - check mysql status \
 * - debug env \
 * - show commands list \0
 */
const args = process.argv.slice( 2, ) ;

const firstArg = args[0] ;

const fs = require('fs') ;
const pathResolver = require('path') ;

require('./../mvc-vendor/read-envfile') ;

const isDev = /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ;

let colorLog = null ;


if( isDev ) {

    try {
        colorLog = require('chalk') ;
    } catch( e ) {

        if( e.code === "MODULE_NOT_FOUND" ) {

            console.log('you should run > npm install chalk --save-dev\nfor a best CLI render') ;
        }
    }
}

const logCLI = (text,color,fontType) => {

    console.log( buildLogCli( text, color, fontType ) ) ;

} ;

const buildLogCli = (text,color,fontType) => {

    return !colorLog ? text: colorLog[color][fontType]( text ) ;
}

require('./../mvc-vendor/read-envfile') ;

const paramsInstall = require('./../mvc-vendor/storage-install.json') ;


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

        const headMessage = '\n\n\t========== DEBUG ROUTER ==========\n\n' ;

        logCLI( headMessage, "yellow", "bold" ) ;

		const cliui = require('cliui')() ;

		cliui.div(
			{
				text: buildLogCli( "method", "yellow", "bold" ) ,
				width: 20 ,
				padding: [2,0,0,2]
			} ,{
				text: buildLogCli( 'path' ,"yellow","bold" ) ,
				width: 20,
				padding: [2,0,0,2]
			} , {
				text: buildLogCli( 'name', "yellow", "bold" ) ,
				width: 20,
				padding: [2,0,0,2]
			}, {
				text: buildLogCli( 'controller', "yellow" ,"bold" ) ,
				width: 20,
				padding: [2,0,0,2]
			}
		) ;

        const textSeparator = "------------------------------------------------------------------------" ;

		cliui.div( {
			text: buildLogCli( textSeparator, "yellow" ,"bold" ),
			width: 80 + ( 2 * 4 ) ,
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
                        text: buildLogCli( route.methods.join(', '), "yellow", "bold" ) ,
                        width: 20 ,
                        padding: [2,0,0,2]
                    },{
                        text: buildLogCli( '"'+route.path+'"' , "green","bold" ) ,
                        width: 20 ,
                        padding: [2,0,0,2]
                    },{
                        text: buildLogCli( route.name, "white","bold" ) ,
                        width: 20 ,
                        padding: [2,0,0,2]
                    }, {
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

    if( paramsInstall.find( arg => /^no-(my)?sql$/i.test(arg) ) ) {

        logCLI("you have install `create-mvc-project` with flag: `--no-sql`", "red", "bold");
        process.exit() ;
    }

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

            console.log( colorLog.yellow.bold( `\ninject dependence as: "${process.env.DAO_NAME}" from any contructor of a controller\n`) ) ;

            process.exit() ;
        }
    }) ;

} else if( /^env$/i.test( firstArg ) ) {

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

    const textHeader = `\n\n\t\tconsole ${buildLogCli("create-mvc-project", "cyan", "bold")} commands list:\n` ;

    console.log( textHeader );

    const cliui = require('cliui')() ;

    cliui.div(
        {
            text: buildLogCli( "debug router", "yellow", "bold" ),
            width: 20,
            padding: [5,3,1,3]
        } , {
            text: ">" + buildLogCli(' node ', "green","bold") + buildLogCli( "./bin/console" , "white", "bold" ) + buildLogCli( " router " , "yellow", "bold" ) + buildLogCli("[:controller --optional]", "cyan" , "bold" ),
            width: 85,
            padding: [5,3,1,3]
        } ,
    ) ;

	cliui.div(
        {
            text: buildLogCli( "build controller", "yellow", "bold" ),
            width: 35,
            padding: [2,3,1,3]
        } , {
            text: ">" + buildLogCli(' node ', "green","bold") + buildLogCli( "./bin/console" , "white", "bold" ) + buildLogCli( " controller " , "yellow", "bold" ) + buildLogCli("[:type --optional (--json, --no-template)]", "cyan" , "bold" ),
            width: 85,
            padding: [2,3,1,3]
        } ,
    ) ;

	cliui.div(
        {
            text: buildLogCli( "check mysql status", "yellow", "bold" ),
            width: 35,
            padding: [2,3,1,3]
        } , {
            text: ">" + buildLogCli(' node ', "green","bold") + buildLogCli( "./bin/console" , "white", "bold" ) + buildLogCli( " mysql " , "yellow", "bold" ) + buildLogCli("[--no-params]", "cyan" , "bold" ),
            width: 85,
            padding: [2,3,1,3]
        } ,
    ) ;

	cliui.div(
        {
            text: buildLogCli( "debug '.env' file", "yellow", "bold" ),
            width: 35,
            padding: [2,3,1,3]
        } , {
            text: ">" + buildLogCli(' node ', "green","bold") + buildLogCli( "./bin/console" , "white", "bold" ) + buildLogCli( " env " , "yellow", "bold" ) + buildLogCli("[--no-params]", "cyan" , "bold" ),
            width: 85,
            padding: [2,3,1,3]
        } ,
    ) ;

	cliui.div(
        {
            text: buildLogCli( "show commands list", "yellow", "bold" ),
            width: 35,
            padding: [2,3,1,3]
        } , {
            text: ">" + buildLogCli(' node ', "green","bold") + buildLogCli( "./bin/console" , "white", "bold" ) + buildLogCli( " help " , "yellow", "bold" ) + buildLogCli("[--no-params]", "cyan" , "bold" ),
            width: 85,
            padding: [2,3,1,3]
        } ,
    ) ;

	cliui.div( {

		text: "read docs: " + buildLogCli( "https://github.com/orivoir/create-mvc-project", "yellow", "bold" ),
		width: 120,
		padding: [ 4,2,4,10 ]
	} ) ;


    console.log( cliui.toString() ) ;

	process.exit( null ) ;
}
