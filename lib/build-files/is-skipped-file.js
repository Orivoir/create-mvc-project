const paramsInstall = process['create-mvc-project'] ;

module.exports = function({
    filename,
    path,
    contentPath
}) {

    // dont want use ejs
    if( !paramsInstall.isEJS ) {

        if(
            /express\.config\.js$/.test( contentPath ) ||
            /\.ejs$/.test( filename ) ||
            /Main\.js$/.test( contentPath )
        ) {
            return true;
        }

        if( /no\-ejs/.test(contentPath) ) {

            return false ;
        }
    } else {

        if( /no\-ejs/.test(contentPath) ) {

            return true ;
        }
    }

    // default not skipped file
    return false ;

}
