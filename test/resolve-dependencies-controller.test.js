const
    {expect, assert} = require('chai') ,

    resolveDpependenciesController = require('./../lib/build-files/content-files/controllers/resolve-dependencies-controller'),

    ClassAnnotations = require('class-annotations')( __dirname ),

    factoryData = require('./factory-data/resolve-dependencies-controller.json')
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

    describe('should be return array dependencies for each:' , () => {

        const an = new ClassAnnotations('./factory-data/files/resolve-dependencies-controller/controller/') ;

        const dependencies = resolveDpependenciesController( an ) ;

        factoryData.forEach( (dependence,index) => {

            const messageIt = `controller => await: ${dependencies[index].controller} receveid: ${dependence.controller}` ;

            it( messageIt, () => {

                expect( dependencies[index].controller ).to.be.equal( dependence.controller ) ;
            } ) ;

            const messageItDependenceList = `list => await: ${dependencies[index].list} receveid: ${dependence.list}`

            it( messageItDependenceList, () => {

                assert.isArray( dependencies[index].list ) ;

                expect( dependencies[index].list ).to.have.lengthOf( dependence.list.length ) ;

            } ) ;

        }) ;

    } ) ;

} ) ;
