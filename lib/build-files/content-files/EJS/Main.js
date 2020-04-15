/**
 * @Controller({
 *      path: "/main"
 * })
 */
class Main {

    /**
     * @Route({
     *      name: "index",
     *      methods: ["GET"],
     *      path: "/"
     * })
     */
    index( request, response ) {

        response.status( 200 ) ;

        response.type('html') ;

        response.render('main/index', {

            controller: 'Main'
        } ) ;
    }

} ;

module.exports = Main ;
