const pathResolver = require('path') ;
const fs = require('fs') ;

module.exports = function( {
    pathFile,
    httpListener,
    server,
    router
} ) {

    const pathEntryPoint = pathResolver.join(
        __dirname , './../' , pathFile
    ) ;

    if( fs.existsSync( pathEntryPoint ) ) {

        let outputEntryPoint = require( pathEntryPoint ) ;

        while( outputEntryPoint instanceof Function ) {

            outputEntryPoint = outputEntryPoint(
                httpListener, // http.Server
                server, // net.Server
                router // express.Router
            ) ;
        }

        return true ;
    } else {

        return false ;
    }

} ;
