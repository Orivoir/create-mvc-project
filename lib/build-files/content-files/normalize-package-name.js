/**
 * @author S.Gaborieau <https://github.com/orivoir>
 *
 * normalize an string brut to valid NPM package name
 * for resolve service dependence of create-mvc-project
 *
 * ./test/normalize-package-name.test.js
 */
module.exports = function( brutPackagename ) {

    if( typeof brutPackagename !== "string" ) {

        throw RangeError('arg1 should be a string package name') ;
    }

    let packagename = brutPackagename.trim() ;

    if( packagename.indexOf('*/') !== -1 || packagename.indexOf('**/') !== -1 ) {

        // removed commentaries
        do {
            const commentary = packagename.indexOf('*/') !== -1 ? "*/" : "**/" ;

            const close = packagename.indexOf( commentary ) ;

            packagename = packagename.slice( close + commentary.length , ) ;

        } while(
            packagename.indexOf('*/') !== -1 &&
            packagename.indexOf('**/') !== -1
        ) ;

        packagename = packagename.trim() ;
    }

    let foundEndAuthorizeChar = false ;

    packagename = packagename.split('').filter( char => {

        if( foundEndAuthorizeChar ) return false ;

        if( !/^[a-z\d\_]$/i.test( char ) ) {

            foundEndAuthorizeChar = true ;
            return false ;
        }

        return true ;

    } ).join('') ;

    if( !packagename.length ) return "" ;

    let copyConvert = "" ;

    packagename.split('').forEach( char => {

        if(
            char === char.toUpperCase() &&
            char !== "_" &&
            !/^\d$/.test( char )
        ) {

            copyConvert += "-" + char.toLocaleLowerCase() ;

        } else {

            copyConvert += char ;
        }

    } ) ;

    return copyConvert ;
} ;
