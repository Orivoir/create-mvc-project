const buildFolders = require('build-directories') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;
const fs = require('fs') ;

module.exports = function( {
    projectName
} ) {

    let currentBuildPathDepth = null ;
    let countFoldersCreate = 0 ;

    if( fs.existsSync(
        pathResolver.join(
            process.cwd() ,
            projectName
        )
    ) ) {

        console.log(
            colorLog.red.bold(
                `Error: folder "${projectName}" already exists in: "${process.cwd()}"`
            )
        ) ;

        process.exit() ;
    }

    [
        "src/controller",
        "views/main",
        "public/assets",
        "bin",
        "mvc-vendor"
    ].forEach( ressource => {

        currentBuildPathDepth = pathResolver.join(
            process.cwd() ,
            projectName,
            ressource
        ) ;

        foldersAppends = null ;

        console.log(
            colorLog.cyan.bold(`create: ${currentBuildPathDepth}`)
        ) ;

        countFoldersCreate += buildFolders( currentBuildPathDepth ).length ;

    } ) ;

    console.log(
        colorLog.green.bold(
            `\nstructure create with appends: ${countFoldersCreate} folders\n`
        )
    ) ;

}
