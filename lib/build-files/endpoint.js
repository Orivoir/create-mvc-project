const pathResolver = require('path') ;
const colorLog = require('chalk') ;
const fs = require('fs') ;
const filesMetaData = require('./files.json') ;
const isSkippedFile = require('./is-skipped-file') ;


const createFile = (pathFile,content,filename) => {

    fs.appendFileSync(
        pathFile ,
        content ,
        "utf-8"
    ) ;

    console.log(
        colorLog.cyan.bold(
            `\t> file: "${filename}" , success`
        )
    ) ;
} ;

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

        if( !isSkippedFile( fileMetaData ) ) {

            createFile( pathFile, content, fileMetaData.filename ) ;
        } else {

            console.log(
                colorLog.yellow.bold(`\t> file: ${fileMetaData.filename}`)
            ) ;
        }
        content = null ;

    } ) ;

} ;
