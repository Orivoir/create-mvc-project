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

require('./../mvc-vendor/read-envfile') ;

const { buildLogCli,logCli } = require('./../mvc-vendor/logger') ;

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

        logCli( headMessage, "yellow", "bold" ) ;

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
                        text: buildLogCli( route.controller , 'yellow', 'bold' ) + "." + buildLogCli( route.methodName, "white", "bold" ) ,
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
                buildLogCli(
                    `"${controllerName}" , already exists in: ./src/controller` , "red", "bold"
                )
            ) ;

            process.exit() ;

        } else {

            console.log(
                buildLogCli(
                    `append: ${controllerName}` , "cyan", "bold"
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
                buildLogCli(
                    `\ncontroller has been created: "./src/controller/${controllerName}.js"` , "green", "bold"
                )
            ) ;

            if( !isJsonController ) {

                buildViewController( controllerName ) ;
            } else {

                console.log(
                    buildLogCli(
                        `\nJSON controller has been created with success\n`, "green", "bold"
                    )
                ) ;
            }
        }

    } else {

        console.log(
            buildLogCli(
                `"${controllerName}" , is not a valid controller name` , "red", "bold"
            )
        ) ;

        process.exit() ;
    }
} else if( /^mysql$/i.test( firstArg ) ) {

    if( paramsInstall.find( arg => /^no-(my)?sql$/i.test(arg) ) ) {

        logCli("you have install `create-mvc-project` with flag: `--no-sql`", "red", "bold");
        process.exit() ;
    }

    const setupMysql = require('./../mvc-vendor/setup-mysql') ;

    setupMysql({

        onNotConfig: function() {

            console.log( buildLogCli(
                `MySQL config not found check your .env file ` ,  "red", "bold"
            ) ) ;
        } ,
        onTryMysql: function( result ) {

            console.log( buildLogCli( `\nGet version MySQL success\n`, "green", "bold" ) ) ;

            console.log( result[0] ) ;

            console.log( buildLogCli( `\ninject dependence as: "${process.env.DAO_NAME}" from any contructor of a controller\n`, "yellow", "bold") ) ;

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
