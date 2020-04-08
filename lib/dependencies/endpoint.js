const {execSync} = require('child_process') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;

module.exports = function({
    projectName
}) {

    const pathExec = pathResolver.join( process.cwd() , projectName ) ;

    [
        {
            name: "class-annotations@0.8.0",
            mode: '--save'
        },
        {
            name: "express" ,
            mode: '--save'
        },
        {
            name: "ejs",
            mode: '--save'
        } , {
            name: 'chalk',
            mode: '--save-dev'
        }
    ].forEach( package => {

        console.log(
            colorLog.cyan(`\ninstall ${package.name} ${/dev/.test(package.mode) ? "dev dependencies" : ""} :\n`)
        ) ;

        const output = execSync( `npm install ${package.name} ${package.mode}` , {
            cwd: pathExec,
            encoding: 'utf8'
        } ) ;

        console.log( output ) ;

    } ) ;

} ;