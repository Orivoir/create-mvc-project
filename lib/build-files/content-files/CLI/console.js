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

require('./../mvc-vendor/read-envfile') ;

const { buildLogCli,logCli } = require('./../mvc-vendor/logger') ;

const paramsInstall = require('./../mvc-vendor/storage-install.json') ;

if( /^route(s|r)?$/i.test( firstArg ) ) {

    const routerCommand = require('./commands/router') ;

    routerCommand( args ) ;

} else if( /^controller$/i.test( firstArg ) ) {

    const controllerCommand = require('./commands/controller') ;

    controllerCommand( args ) ;

} else if( /^mysql$/i.test( firstArg ) ) {

    if( paramsInstall.find( arg => /^no-(my)?sql$/i.test(arg) ) ) {

        logCli("you have install `create-mvc-project` with flag: `--no-sql`", "red", "bold");
        process.exit() ;
    }

    if(
        !args[1] ||
        ( typeof  args[1] === "string" && !args[1].trim().length )
    ) {

        const mysqlTest = require('./commands/mysql-test') ;

        mysqlTest() ;
    } else {

        const mysqlHandler = require('./commands/mysql-handler') ;

        mysqlHandler( args ) ;
    }

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
