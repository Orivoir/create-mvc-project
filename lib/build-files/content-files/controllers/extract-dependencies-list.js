/**
 * @author S.Gaborieau <https://github.com/orivoir>
 *
 * convert string constructor header to list string[] arguments
 * for resolve service dependence of create-mvc-project
 *
 * ./test/extract-dependencies-list.test.js
 */
module.exports = function( headerConstructor ) {

    if( typeof headerConstructor !== "string" ) {

        throw RangeError('arg1 header constructor should be a string value') ;
    }

    headerConstructor = headerConstructor
        .replace('constructor','')
        .replace('(','')
        .replace(')','')
        .trim()
    ;

    headerConstructor = headerConstructor.split(',').map( dependence => (
        dependence.trim()
    ) ) ;

    return headerConstructor ;
} ;