/**
 * @Controller({
 *      path: "/main"
 * })
 */
class Main {

    /**
    * @Route( {
    *      name: "index",
    *      methods: ["GET"],
    *      path: "/"
    * } )
    */
    index( request, response ) {

        response.status( 200 ) ;

        response.type( 'json' ) ;

        response.json( {

            success: true,
            status: 200,
            controller: './src/controller/Main.js',
            details: 'unicorn power <3'
        } ) ;
    }

} ;

module.exports = Main ;
