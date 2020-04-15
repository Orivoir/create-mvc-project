const
    {expect,assert} = require('chai') ,
    factoryData = require('./factory-data/extract-constructor-header.json') ,
    extractConstructorHeader = require('./../lib/build-files/content-files/controllers/extract-constructor-header') ,

    fs = require('fs') ,
    pathResolver = require('path')
;

describe('`extract-constructor-header` function start' , () => {


    it('should be an function' , () => {

        assert.isFunction( extractConstructorHeader ) ;

    } ) ;

    it('should accept only string value in arg1' , () => {

        let fxThrow = null ;

        [
            {
                arg1: true,
                isExcept: true
            } ,
            {
                arg1: [],
                isExcept: true
            } ,
            {
                arg1: "",
                isExcept: false
            } ,
            {
                arg1: ["",""],
                isExcept: true
            } ,
            {
                arg1: {a:"",b:""},
                isExcept: true
            } ,
        ].forEach( attempt => {

            fxThrow = () => extractConstructorHeader( attempt.arg1 ) ;

            if( attempt.isExcept ) {

                expect( fxThrow ).to.be.throw( RangeError, "arg1 content controller should be a string value" ) ;

            } else {

                expect( fxThrow ).to.be.not.throw( RangeError, "arg1 content controller should be a string value" ) ;

            }

        } ) ;

    } ) ;

    describe('should return exactly `string` value' , () => {

        factoryData.forEach( data => {

            const messageIt = `entry content file from: "${data.entry}" output should be content file from: "${data.output}"`;

            it( messageIt, () => {

                const classcontent = fs.readFileSync(
                    pathResolver.join(
                        __dirname, './factory-data/',data.entry
                    ) ,
                    'utf-8'
                ) ;

                const output = fs.readFileSync(
                    pathResolver.join(
                        __dirname, './factory-data/',data.output
                    ) ,
                    'utf-8'
                ) ;

                expect(
                    extractConstructorHeader( classcontent )

                ).to.be.equal( output ) ;

            } ) ;

        } ) ;

    } ) ;

} ) ;
