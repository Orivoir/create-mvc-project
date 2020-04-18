const paramsInstall = process['create-mvc-project'] ;

module.exports = function({
    filename,
    contentPath
}) {

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

    if( !paramsInstall.isMySQL ) {

        if( /no\-sql/.test(contentPath) ) {

            return false;
        } else if( /sql/.test( contentPath ) ) {

            return true;
        }

    } else {

        if( /no\-sql/.test(contentPath) ) {

            return true;
        }
    }

    // default not skipped file
    return false ;

}
