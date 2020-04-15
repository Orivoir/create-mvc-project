const express = require('express') ;

const config = {

    // define your express middlewares here:
    // http://expressjs.com/en/guide/writing-middleware.html#ecriture-de-middleware-utilisable-dans-les-applications-express

    // your middleware should be an function or an array
    uses: [

        // define the static folder
        [ '/public' , express.static( 'public' ) ] ,

        // request logger
		function( request, response, next ) {

			console.log(`${request.method}\t"${request.url}"`) ;

			// free middleware
			next() ;
		}
    ] ,

    // your setters should be an array ( key, value )
    sets: [

        // https://ejs.co/

        // you template
        [ 'view engine', 'ejs' ]
    ]

} ;

module.exports = {
    express,
    config
} ;
