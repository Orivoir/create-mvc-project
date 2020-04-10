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
            mode: '--save',
            author: '<https://github.com/Orivoir/>'
        },
        {
            name: "express" ,
            mode: '--save',
            author: ''
        },
        {
            name: "ejs",
            mode: '--save',
            author: '<https://github.com/mde/>'
        } , {
            name: 'chalk',
            mode: '--save-dev',
            author: '<https://github.com/chalk/>'
        } , {
            name: 'parse-database-url' ,
            mode: '--save' ,
            author: '<https://github.com/pwnall/>'
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