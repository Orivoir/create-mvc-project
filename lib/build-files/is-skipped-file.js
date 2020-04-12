const paramsInstall = process['create-mvc-project'] ;

module.exports = function({
    filename,
    contentPath
}) {

    // dont want use ejs
    if( !paramsInstall.isEJS ) {

        if( /no\-ejs/.test( contentPath ) ) {

            return false ;
        }

        if(
            /express\.config\.js$/.test( contentPath ) ||
            /(\.ejs|ejs\.txt)$/.test( filename ) ||
            /(ejs\.txt)$/.test( contentPath ) ||
            /Main\.js$/.test( contentPath )
        ) {
            return true;
        }
    } else {

        if( /no\-ejs/.test(contentPath) ) {

            return true ;
        }
    }

    // default not skipped file
    return false ;

}
