const
    {assert,expect} = require('chai'),
    pathResolver = require('path') ,

    ClassAnnotations = require('class-annotations')(
        pathResolver.join( __dirname,'./factory-data/files/' )
    ) ,
    factoryData = require('./factory-data/build-routes.json') ,

    fs = require('fs') ,

    buildRoutes = require('./../lib/build-files/content-files/router/build-routes')
;

describe('`build-routes` function start', () => {

    it('should be a function', () => {

        assert.isFunction( buildRoutes ) ;

    } ) ;

    it('should accept only `object` as arg1', () => {

        const fxThrow = () => buildRoutes( null ) ;

        const fxNotThrow = () => buildRoutes( {} ) ;

        expect( fxThrow ).to.be.throw( RangeError, "arg1: annotations controller should be a object" ) ;

        expect( fxNotThrow ).to.be.not.throw( RangeError ) ;

    } ) ;


    describe('should build routes:' , () => {

        const an = new ClassAnnotations('./build-routes/controller/') ;

        const routes = buildRoutes( an ) ;

        factoryData.output.forEach( (route,index) => {

            Object.keys( route ).forEach( (key) => {

                const messageIt = `await: ${route[key]} receveid: ${routes[index][key]} `

                it( messageIt , () => {

                    if( route[key] instanceof Array ) {

                        assert.isArray( routes[index][key] ) ;
                        expect( route[key] ).to.be.lengthOf( routes[index][key].length ) ;

                    } else {
                        expect( route[key] ).to.be.equal( routes[index][key] ) ;
                    }


                } ) ;

            } ) ;

        } ) ;

    } ) ;

} ) ;
