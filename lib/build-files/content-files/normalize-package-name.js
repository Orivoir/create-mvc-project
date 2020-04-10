module.exports = function( brutPackagename ) {

    let packagename = brutPackagename.replace('Package','').trim() ;

    let foundEndAuthorizeChar = false ;

    packagename.split('').filter( char => {

        if( foundEndAuthorizeChar ) return false ;

        if( !/^[a-z\d\_]$/i.test( char ) ) {

            foundEndAuthorizeChar = true ;
            return false ;
        }

        return true ;

    } ).join('') ;

    let copyConvert = "" ;

    packagename.split('').forEach( char => {

        if( char === char.toUpperCase() && char !== "_" && !/^\d$/.test(char) ) {

            copyConvert += "-" + char.toLocaleLowerCase() ;

        } else {

            copyConvert += char ;
        }

    } ) ;

    return copyConvert ;
} ;
