#!/usr/bin/env node

const projectName = process.argv.slice( 2 , 3 )[0] ;

const args = process.argv.slice( 3 , )
/* persist only arg with an format type: "--argname" or "--argname=value" */
.filter( arg => {

    return !!/^(\-\-)([a-z]{1}[a-z\d\_\-]{1,254})(\=([a-z]{1}[a-z\d\_\-]{1,254}))?$/i.test( arg ) ;
} )
/* normalize arg */
.map( arg => arg.slice( 2, ) ) ;

process['create-mvc-project'] = {

    // check if want use EJS templating
    isEJS: !args.find( arg => /^no-ejs$/i.test(arg) )
} ;

const colorLog = require('chalk') ;

const _package = require('./../package.json') ;

const isValidProjectName = name => (
    !!name &&
    typeof name === "string" &&
    /^[a-z]{1}[a-z\d\_\-]{1,254}$/i.test( name )
) ;

if( isValidProjectName( projectName ) ) {

    const startTime = Date.now() ;

    console.log( colorLog.green.bold( `init a new MVC project for: "${projectName}"\n` ) ) ;

    const buildFolders = require('./../lib/build-folders/endpoint') ;
    const buildFiles = require('./../lib/build-files/endpoint') ;
    const resolveDependencies = require('./../lib/dependencies/endpoint') ;

    buildFolders( {
        projectName
    } ) ;

    console.log(
        colorLog.green.bold( `start create files for: "${projectName}"\n`)
    ) ;

    buildFiles({
        projectName
    } ) ;

    console.log(
        colorLog.green.bold(`\nstart install dependencies form NPM:\n`)
    ) ;

    resolveDependencies( {
        projectName
    } ) ;

    console.log(
        colorLog.green.bold(`project init in: ${ Date.now()-startTime}ms`)
    ) ;

    console.log(
        colorLog.cyan.bold(`\n> cd ${projectName}\n\n> npm start\n\nenjoy and unicorn power <3 !\n`)
    ) ;

} else {

    if( /^(\-\-?)v(ersion)?$/i.test(projectName) ) {

        console.log(
            colorLog.yellow.bold( "\ncreate-mvc-project" )
            + " version: " +
            colorLog.green.bold( _package.version + "\n" )
        ) ;

    } else if( /^(\-\-?)(author|owner)$/i.test(projectName) ) {

        console.log(
            colorLog.cyan.bold(
                `\n\tGABORIEAU Samuel\n\n\t<https://github.com/Orivoir>\n`
            )
        ) ;

    } else {

        console.log(
            colorLog.red.bold( `Error: "${projectName}" , is not a valid project name` )
        ) ;
    }

}