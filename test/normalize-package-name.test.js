const
    {expect,assert} = require('chai') ,

    normalizePackagename = require('./../lib/build-files/content-files/normalize-package-name')
;

describe('`normalize-package-name` function start' , () => {

    it('should be a function' , () => {

        assert.isFunction( normalizePackagename ) ;

    } ) ;

    it('should accept only a `string` in arg1' , () => {

        let fxAttempt = null ;

        [
            {
                arg1: true,
                isExcept: true
            }, {
                arg1: [],
                isExcept: true
            }, {
                arg1: "",
                isExcept: false
            }, {
                arg1: {a: "", b:"" },
                isExcept: true
            }
        ].forEach( attempts => {

            fxAttempt = () => normalizePackagename( attempts.arg1 ) ;

            if( attempts.isExcept ) {

                expect( fxAttempt ).to.be
                    .throw( RangeError , 'arg1 should be a string package name' )
                ;

            } else {

                expect( fxAttempt ).to.be.not
                    .throw( RangeError , 'arg1 should be a string package name' )
                ;

            }

        } ) ;

    } ) ;

    it('should return `string` value' , () => {

        assert.isString( normalizePackagename('abc') ) ;

        assert.isString( normalizePackagename('') ) ;

        assert.isString( normalizePackagename('85') ) ;

        assert.isString( normalizePackagename('ø') ) ;

    } ) ;

    describe('should return exactly `string` value' , () => {

        [
            {
                entry: 'abcDef',
                output: 'abc-def'
            } , {
                entry: '  ijk_12Ijk',
                output: 'ijk_12-ijk'
            } , {
                entry: ' /* stuff */abcDef',
                output: 'abc-def'
            } , {
                entry: '/** lorem ipsum */ abc /* stuff ...*/',
                output: 'abc'
            }, {
                entry: ' abc@çdef',
                output: 'abc'
            }, {
                entry: '@blah',
                output: ''
            } , {
                entry: ' abcDefIjk  ',
                output: 'abc-def-ijk'
            }
        ].forEach( attempt => {

            const attemptMessage = `entry: "${attempt.entry}" output should be: "${attempt.output}"`;

            it( attemptMessage , () => {

                expect(
                    normalizePackagename( attempt.entry )

                ).to.be.equal( attempt.output ) ;

            } ) ;

        } ) ;

    } ) ;

} ) ;
