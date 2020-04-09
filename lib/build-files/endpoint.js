const pathResolver = require('path') ;
const colorLog = require('chalk') ;
const fs = require('fs') ;
const filesMetaData = require('./files.json') ;

module.exports = function({
    projectName
}) {

    let pathFile = null ;
    let content = null ;

    filesMetaData.forEach( fileMetaData => {

        pathFile = pathResolver.join(
            process.cwd() ,
            projectName ,
            fileMetaData.path ,
            fileMetaData.filename
        ) ;

        if( fileMetaData.contentPath ) {

            content = fs.readFileSync(
                pathResolver.join(
                    __dirname ,
                    fileMetaData.contentPath
                ) ,
                "utf-8"
            ) ;

        } else {

            content = "" ;
        }

        fs.appendFileSync(
            pathFile ,
            content ,
            fileMetaData.charset || "utf-8"
        ) ;

        content = null ;

        console.log(
            colorLog.cyan.bold(
                `\t> file: "${fileMetaData.filename}" , success`
            )
        ) ;

    } ) ;


} ;
