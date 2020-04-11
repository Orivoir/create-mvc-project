const fs = require('fs') ;
const pathResolver = require('path') ;

const createMvcProjectEnvVars = {} ;

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
        !/^(\#|\/\/|\/\*\*?)/.test( line.split('=')[0] )
    ) {

        return true ;
    }

    return false ;

} )
// .map( line => (
    // line.split('=').map( partialValue => partialValue.trim() )
// ) )
.forEach( envLine => {

	const key = envLine.split( '=' )[0].trim() ;
	const value = envLine.split( '=' ).slice( 1,).join('=')  ;

    createMvcProjectEnvVars[ key ] = value ;
    process.env[ key ] = value ;

} ) ;

process['create-mvc-project-env'] = createMvcProjectEnvVars ;
