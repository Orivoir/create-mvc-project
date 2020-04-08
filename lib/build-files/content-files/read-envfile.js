const fs = require('fs') ;
const pathResolver = require('path') ;

fs.readFileSync(
    pathResolver.join(
        __dirname ,
        './../.env'
    ) ,
    "utf-8"
)
.split('\n')
.map( line => line.trim() )
.filter( line => !!line.length )
.filter( line => {

    if (
        line.split('=').length === 2 &&
        !/^(\#|\/\/|\/\*\*?)$/.test( line.split('=')[0] )
    ) {

        return true ;
    }

    return false ;

} )
.map( line => (
    line.split('=').map( partialValue => partialValue.trim() )
) )
.forEach( envLine => {

    const key = envLine[0] ;
    const value = envLine[1] ;

    process.env[ key ] = value ;

} ) ;
