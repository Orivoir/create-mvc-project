/**
 * @Controller({
 *      path: "/bar"
 * })
 */
class Bar {

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