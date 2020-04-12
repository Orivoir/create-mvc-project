const {exec,execSync} = require('child_process') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;
const Ora = require('ora');

const paramsInstall = process['create-mvc-project'] ;

async function execAsync( package, pathExec ) {

    // const e = function() {

    //     return [...arguments] ;
    // } ;

    exec( `npm install ${package.name} ${package.mode}` , {
        cwd: pathExec,
        encoding: 'utf8'
    }, e ) ;

} ;

module.exports = function({
    projectName
}) {

    // let spinner = null ;
    const packages2exec = [] ;
    const pathExec = pathResolver.join( process.cwd() , projectName ) ;
    const dependencies = require('./dependacies.json') ;

    let skippeds = 0 ;

    dependencies.forEach( package => {

        // check if skip install dependacies
        if(
            !paramsInstall.isEJS &&
            package.name === "ejs"
        ) {

            console.log(
                colorLog.yellow.bold(
                    '\ninstall EJS dependence have been skipped\n'
                )
            ) ;

            skippeds++ ;

        } else {
            packages2exec.push( package )

            // console.log(
            //     colorLog.cyan(`\ninstall ${package.name} ${/dev/.test(package.mode) ? "as dev dependence" : ""} ${package.author} :`)
            // ) ;

            // spinner = new Ora( {
            //     discardStdin: false,
            //     text: colorLog`install {cyan.bold ${package.name}} ${/dev/.test(package.mode) ? "as dev dependence" : ""} ${package.author}\n\n`,
            //     spinner: {
            //         "frames": [
            //             // "⠋",
            //             // "⠙",
            //             // "⠹",
            //             // "⠸",
            //             // "⠼",
            //             // "⠴",
            //             // "⠦",
            //             // "⠧",
            //             // "⠇",
            //             // "⠏"
            //             // this unicode not support for on all terminal

            //             "/",
            //             "+",
            //             "*"
            //         ]
            //     }
            // } ) ;

            // spinner.render() ;

            // sync blocking event loop
            // console.log( output ) ;
        }
    } ) ;

    // console.log( packages2exec );

    return Promise.all( packages2exec.map( p => {

        return execAsync( p, pathExec  ) ;
    } ) ) ;

    console.log(
        colorLog.cyan.bold(`install: ${dependencies.length - skippeds} dependencies from NPM with success\n`)
    ) ;

} ;