const pathResolver = require('path') ;
const { buildLogCli,logCli } = require('./../../mvc-vendor/logger') ;
// log routes create

module.exports = function( args ) {

    let controllerName = args[ 1 ] ;

    if( typeof controllerName === "string" ) {

        controllerName = controllerName.trim() ;
    }

    const buildRoutes = require('./../../mvc-vendor/build-routes') ;
    const writeFiles = require('./../../mvc-vendor/write-routes') ;

    const ClassAnnotation = require('class-annotations')(
        pathResolver.join( __dirname , './../../' )
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
    } ) ;

} ;
