const
    {expect, assert} = require('chai'),
    extractDependenciesList = require('./../lib/build-files/content-files/extract-dependencies-list'),
    factoryData = require('./factory-data/extract-dependencies-list.json')
;

describe('`extract-dependencies-list` function start', () => {

    it('should be a function' , () => {

        assert.isFunction( extractDependenciesList ) ;

    } ) ;

    it('should accept only a `string` in arg1' , () => {

        const fxThrow = () => extractDependenciesList( true ) ;

        expect( fxThrow ).to.be.throw( RangeError, "arg1 header constructor should be a string value" );

    } ) ;

    describe('should return exactly `string[]` value' , () => {

        factoryData.forEach( attempt => {

            const messageIt = `entry: "${attempt.entry}" output should be: string[${attempt.output.join(',')}]`

            it( messageIt, () => {

                expect( extractDependenciesList( attempt.entry ).join(',') ).to.be.equal( attempt.output.join(',') ) ;
            } ) ;

        } );

    } ) ;

} ) ;
