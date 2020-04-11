const pathResolver = require('path') ;
const colorLog = require('chalk') ;
const fs = require('fs') ;
const filesMetaData = require('./files.json') ;
const isSkippedFile = require('./is-skipped-file') ;


const createFile = (pathFile,content,fileMetaData,isDevMode) => {

    fs.appendFileSync(
        pathFile ,
        content ,
        "utf-8"
    ) ;

    if( isDevMode ) {

        console.log(
            colorLog.cyan.bold(
                `\t> file: "${fileMetaData.contentPath}" as ".${pathResolver.join( fileMetaData.path, fileMetaData.filename ).split('\\').join('/')}"`
            )
        ) ;
    }
} ;

module.exports = function({
    projectName,
    args
}) {

    let pathFile = null ;
    let content = null ;

    let skippeds = 0 ;

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

            createFile( pathFile, content, fileMetaData , args.includes('dev-mode') ) ;

        } else {

            skippeds++ ;

            if( args.includes('dev-mode') ) {
                console.log(
                    colorLog.yellow.bold(`\t\t> file: "${fileMetaData.contentPath}" has been skipped`)
                ) ;
            }
        }
        content = null ;

    } ) ;

    console.log(
        colorLog`local files append: {green.bold ${filesMetaData.length - skippeds} files}`
    ) ;

} ;
