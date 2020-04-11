/**
 * @classdesc lorem ipsum
 * @constructor lorem ipsum
 */

/**
 * @Controller({
 *      path: "/main"
 * })
 */
class Main {

    constructor(
        chalk
        ,path,
        dao
    ) {
        // ...
    }

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
