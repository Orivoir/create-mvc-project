const {execSync} = require('child_process') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;

const paramsInstall = process['create-mvc-project'] ;

module.exports = function({
    projectName
}) {

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

            console.log(
                colorLog.cyan(`\ninstall ${package.name} ${/dev/.test(package.mode) ? "as dev dependence" : ""} ${package.author} :`)
            ) ;

            const output = execSync( `npm install ${package.name} ${package.mode}` , {
                cwd: pathExec,
                encoding: 'utf8'
            } ) ;

            console.log( output ) ;
        }


    } ) ;

    console.log(
        colorLog.cyan.bold(`install: ${dependencies.length - skippeds} dependencies from NPM with success\n`)
    ) ;

} ;