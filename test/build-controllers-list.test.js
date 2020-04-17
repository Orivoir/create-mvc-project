const
    {expect, assert} = require('chai'),

    buildControllersList = require('./../lib/build-files/content-files/controllers/build-controllers-list'),

    ClassAnnotations = require('class-annotations')( __dirname ),

    factoryData = require('./factory-data/build-controllers-list.json') ,

    pathResolver = require('path')
;

describe('test `build-controllers-list` module', () => {

    it('should be a function', () => {

        assert.isFunction( buildControllersList ) ;

    } ) ;

    it('should accept only annotations object as arg1' , () => {

        const fxThrow = () => buildControllersList() ;

        expect( fxThrow ).to.be.throw( RangeError, "arg1: annotations should be a object" ) ;
    } ) ;

    describe('should build controllers list' , () => {

        const an = new ClassAnnotations( './factory-data/files/build-controllers-list/controller/' )

        const controllers =  buildControllersList( an ) ;

        factoryData.output.forEach( (attempt,index) => {

            const messageIt = `await: ${attempt.controller} receveid: ${controllers[index].controller}` ;

            it( messageIt, () => {

                expect( attempt.controller ).to.be.equal( controllers[index].controller ) ;
            } ) ;

            it(`is absolute path file for controller: ${attempt.controller}`, () => {

                assert.isTrue( pathResolver.isAbsolute( controllers[index].path ) ) ;
            } ) ;

        } ) ;

    } ) ;

} ) ;
