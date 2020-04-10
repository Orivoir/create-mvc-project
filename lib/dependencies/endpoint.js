const {execSync} = require('child_process') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;

const paramsInstall = process['create-mvc-project'] ;

module.exports = function({
    projectName
}) {

    const pathExec = pathResolver.join( process.cwd() , projectName ) ;
    const dependencies = require('./dependacies.json') ;

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

        } else {

            console.log(
                colorLog.cyan(`\ninstall ${package.name} ${/dev/.test(package.mode) ? "dev dependencies" : ""} :\n`)
            ) ;

            const output = execSync( `npm install ${package.name} ${package.mode}` , {
                cwd: pathExec,
                encoding: 'utf8'
            } ) ;

            console.log( output ) ;
        }


    } ) ;

} ;