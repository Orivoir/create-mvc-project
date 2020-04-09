const fs = require('fs') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;

module.exports = function( controllerName ) {

    controllerName = controllerName.charAt( 0 ).toLocaleLowerCase() + controllerName.slice( 1 , ) ;

    const pathView = pathResolver.join(
        __dirname ,
        `./../views/${controllerName}`
    ) ;

    if( !fs.existsSync( pathView ) ) {

        fs.mkdirSync(
            pathView
        ) ;

        fs.appendFileSync(
            pathResolver.join(
                pathView , 'index.ejs'
            ) ,
            fs.readFileSync(
                pathResolver.join(
                    __dirname ,
                    './index-model'
                )
            )
        ) ;

        console.log(
            colorLog.green.bold(`views has been created: "./views/${controllerName}/index.ejs"\n`)
        ) ;

    } else {

        console.log(
            colorLog.red.bold(`folder views: "./views/${controllerName}/" ,already exists`)
        ) ;
    }

} ;
