const
    {expect, assert} = require('chai') ,

    resolveDpependenciesController = require('./../lib/build-files/content-files/controllers/resolve-dependencies-controller')
;

describe('test `resolve-dependencies-controller` module' , () => {

    it('should be a function' , () => {

        assert.isFunction( resolveDpependenciesController ) ;

    } ) ;

    it('should throw RangeError while arg1 not a object' , () => {

        let fxThrow = () => resolveDpependenciesController( null ) ;
        expect( fxThrow ).to.be.throw( RangeError, "arg1: annotations, should be a object") ;

        fxThrow = () => resolveDpependenciesController( "" ) ;
        expect( fxThrow ).to.be.throw( RangeError, "arg1: annotations, should be a object") ;

        fxThrow = () => resolveDpependenciesController( [] ) ;
        expect( fxThrow ).to.be.throw( RangeError, "arg1: annotations, should be a object") ;

        fxThrow = () => resolveDpependenciesController( true ) ;
        expect( fxThrow ).to.be.throw( RangeError, "arg1: annotations, should be a object") ;

    } ) ;

} ) ;