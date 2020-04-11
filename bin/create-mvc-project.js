#!/usr/bin/env node

const projectName = process.argv.slice( 2 , 3 )[0] ;

const fs = require('fs') ;
const pathResolver = require('path') ;

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


// write args install in a storage JSON
// for persist integrity CLI destribute post install
const writeStorageInstall = data => {

    fs.writeFileSync(
        pathResolver.join(
            __dirname,
            './../lib/build-files/content-files/storage-install.json'
        ) ,
        JSON.stringify( data )
    ) ;
} ;

writeStorageInstall( args ) ;

const colorLog = require('chalk') ;

const _package = require('./../package.json') ;

const isValidProjectName = name => (
    !!name &&
    typeof name === "string" &&
    /^[a-z]{1}[a-z\d\_\-]{1,254}$/i.test( name )
) ;

if( isValidProjectName( projectName ) ) {

    const startTime = Date.now() ;

    const cfonts = require('cfonts') ;

    cfonts.say(
        `C.M.P` ,
        {
            env: 'node',
            space: true,
            gradient: ["blue","#2AB92A"],
            transitionGradient: true,
        }
    ) ;

    console.log(colorLog`VERSION {green.bold ${_package.version}}`) ;

    console.log( colorLog`\ninit a new CMP project for {cyan.bold ${projectName}}\n` ) ;


    if( args.includes('header-mode') ) {

        process.exit() ;
    }

    const buildFolders = require('./../lib/build-folders/endpoint') ;
    const buildFiles = require('./../lib/build-files/endpoint') ;
    const resolveDependencies = require('./../lib/dependencies/endpoint') ;

    buildFolders( {
        projectName,
        args
    } ) ;

    console.log(
        colorLog`start create files for: {cyan.bold ${projectName}}\n`
    ) ;

    buildFiles({
        projectName,
        args
    } ) ;

    console.log(
        colorLog.yellow.bold('\nclean local storage args install\n')
    ) ;

    // clean storage install after build files
    writeStorageInstall( [] ) ;

    if( !args.includes('no-npm') ) {

        console.log(
            colorLog`\nstart install dependencies form {red.bold NPM}:\n`
        ) ;

        resolveDependencies( {
            projectName
        } ) ;
    }

    const cliui = require('cliui')() ;

    cliui.div({
        text: colorLog`project init in: {green.bold ${ Date.now()-startTime}ms}` ,
        width: 80,
        padding: [1,8,2,0]
    }) ;

    cliui.div({
        text: colorLog`\n> cd {cyan.bold ${projectName}}\n\n> npm start`,
        width: 80,
        padding: [1,8,2,0]
    }) ;

    cliui.div({
        text: colorLog`enjoy and unicorn power {red.bold <3} !\n`,
        width: 60,
        padding: [0,0,0,0],
        align: 'right'
    }) ;

    console.log( cliui.toString() ) ;


    process.exit() ;

} else {

    if( /^(\-\-?)v(ersion)?$/i.test(projectName) ) {

        console.log(
            colorLog.yellow.bold( "\ncreate-mvc-project" )
            + " version: " +
            colorLog.green.bold( _package.version + "\n" )
        ) ;

        process.exit() ;

    } else if( /^(\-\-?)(author|owner)$/i.test(projectName) ) {

        console.log(
            colorLog.cyan.bold(
                `\n\tGABORIEAU Samuel\n\n\t<https://github.com/Orivoir>\n`
            )
        ) ;

        process.exit() ;

    } else {

        console.log(
            colorLog.red.bold( `Error: "${projectName}" , is not a valid project name` )
        ) ;

        process.exit() ;
    }

}