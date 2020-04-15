const
    fs = require('fs') ,
    pathResolver = require('path')
;

module.exports = function( routes , callback = null ) {

    const routesJSON = routes.map( route => {

        Object.keys( route ).forEach( attribute => {

            // not detect: [Getter] , [Setter]
            if( route[attribute] instanceof Function ) {

                delete route[attribute] ;
            }

        } ) ;

        return route ;

    } ) ;

    fs.writeFile(
        pathResolver.join( __dirname , '/routes.json' ) ,

        // persist  only not circular structur JSON routes
        JSON.stringify( routesJSON )  ,
        function( err ) {

            if( err ) {

                throw "cant debug router" ;
            }

            callback instanceof Function ? callback( routesJSON ) :null;
        }
    ) ;
} ;
