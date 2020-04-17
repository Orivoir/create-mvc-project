/**
 * @Controller({
 *      path: "/bar"
 * })
 */
class Bar {

    constructor( abc, def
        ,stuff
    ) {

    }

    /**
     * @Route({
     *  name: "bar_index",
     *  path: "/index",
     *  methods: ["GET","POST"]
     * })
     */
    index() {

    }
}

module.exports = Bar;