const
    {expect,assert} = require('chai'),

    resolveConflictRoutes = require('./../lib/build-files/content-files/router/resolve-conflict-routes') ,

    factoryData = require('./factory-data/resolve-confict-routes.json')
;

describe('test `resolve-confict-routes` module' , () => {

    it('should be a function' , () => {

        assert.isFunction( resolveConflictRoutes ) ;

    } ) ;

    describe('should throw RangeError arg1 while not object of routes' , () => {

        let fxAttempt = null ;

        [
            {
                arg1: null,
                isThrow: true,
            },
            {
                arg1: {
                    name: "foo",
                    path: "/foo"
                },
                isThrow: true,
            },
            {
                arg1: [{
                    name: "foo",
                    path: "/foo",
                    methodName: true,
                    controller: ""
                }],
                isThrow: true,
            },
            {
                arg1: [{
                    name: "foo",
                    path: "/foo",
                    methodName: "index",
                    controller: ""
                }],
                isThrow: true,
            },
            {
                arg1: [{
                    name: "foo",
                    path: "/foo",
                    methodName: "index",
                    controller: "Foo"
                }],
                isThrow: false,
            },
        ].forEach( attempt => {

            const messageIt = `should ${!attempt.isThrow ? "not":""} throw RangeError` ;

            it( messageIt, () => {

                fxAttempt = () => resolveConflictRoutes( attempt.arg1 ) ;

                if( attempt.isThrow ) {
                    expect( fxAttempt ).to.be.throw( RangeError ) ;
                } else {
                    expect( fxAttempt ).to.be.not.throw( RangeError ) ;
                }

            } ) ;

        } ) ;


    } ) ;

    describe('should check factory routes' , () => {

        factoryData.forEach( attempt => {


            const messageIt = `should be ${!attempt.isConflict ? "not": ""} found conflict`;

            it( messageIt, () => {

                const isConflict = resolveConflictRoutes( attempt.routes ) ;

                if( attempt.isConflict ) {

                    assert.isTrue( isConflict ) ;
                } else {

                    assert.isFalse( isConflict ) ;
                }
            } ) ;

        } ) ;

    } ) ;

} ) ;

