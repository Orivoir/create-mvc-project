/**
 * @Controller({
 *      path: "/main"
 * })
 */
class Main {

    constructor( path ) {

        this.path = path ;

        this.views = this.path.resolve(
            __dirname , './../../views/main/'
        ) ;
    }

    /**
    * @Route( {
    *      name: "index",
    *      methods: ["GET"],
    *      path: "/"
    * } )
    */
    index( request, response ) {

        response.status( 200 ) ;

        response.type( 'html' ) ;

        response.sendFile(
            this.path.resolve(
                this.views , 'index.html'
            )
        ) ;
    }

} ;

module.exports = Main ;
