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

} ) ;
