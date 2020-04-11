const pathResolver = require('path') ;
const fs = require('fs') ;

module.exports = function( {
    pathFile,
    args
} ) {

    const pathEntryPoint = pathResolver.join(
        __dirname , './../' , pathFile
    ) ;

    if( fs.existsSync( pathEntryPoint ) ) {

        let outputEntryPoint = require( pathEntryPoint ) ;

        while( outputEntryPoint instanceof Function ) {

            outputEntryPoint = outputEntryPoint( ...args ) ;
        }

        return true ;
    } else {

        return false ;
    }

} ;
