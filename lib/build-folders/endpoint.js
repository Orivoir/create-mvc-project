const buildFolders = require('build-directories') ;
const pathResolver = require('path') ;
const colorLog = require('chalk') ;
const fs = require('fs') ;

module.exports = function( {
    projectName,
    args
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
        "bin/commands",
            "mvc-vendor/WOS",
        "config"
    ].forEach( ressource => {

        currentBuildPathDepth = pathResolver.join(
            process.cwd() ,
            projectName,
            ressource
        ) ;

        foldersAppends = null ;

        if( args.includes('dev-mode') ) {

            console.log(
                colorLog.cyan.bold(`\t> folder: ${currentBuildPathDepth} , success`)
            ) ;
        }

        countFoldersCreate += buildFolders( currentBuildPathDepth ).length ;

    } ) ;

    console.log(
        colorLog`\nstructure create with appends: {green.bold ${countFoldersCreate} folders}\n`
    ) ;

}
