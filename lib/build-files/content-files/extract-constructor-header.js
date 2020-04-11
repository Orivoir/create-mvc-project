/**
 * @author S.Gaborieau <https://github.com/orivoir>
 *
 * extract header constructor of a content class ES6 syntax
 * for resolve service dependence of create-mvc-project
 *
 * ./test/extract-constructor-header.test.js
 */
module.exports = function( content ) {

    if( typeof content !== "string" ) {

        throw RangeError('arg1 content controller should be a string value');
    }

    if(  content.indexOf('class') === -1 || content.indexOf('constructor') === -1 ) {
        return null;
    }

    content = content.split('\n').map( l => l.trim() ).filter( l => !!l.length ) ;

    let isInsideCommentary = false;

	let lineOpenConstructor = null;


	content.forEach( (line,key) => {

        line = line.trim() ;

        if( isInsideCommentary ) {

            if( line.indexOf('*/') !== -1 ) {

                isInsideCommentary = false ;
            }
        }

        if( !isInsideCommentary ) {

            if( !lineOpenConstructor && /^constructor/.test( line ) ) {

                lineOpenConstructor = key ;
            }
        }

    } ) ;

    let startConstrucor = null ;

    if( lineOpenConstructor === null ) {

        // here high risk of fail the resolution of the header constructor
        // here try resolve with considering content as minified script
        // because constructor function is not define on isolate line
        const hwakba = content[0].indexOf('constructor') ;

        startConstrucor = content[0].slice( hwakba, ) ;

    } else {

        startConstrucor = content.slice( lineOpenConstructor , ).join('\n') ;
    }

    let _construct = "" ;

    let endl = false ;

    isInsideCommentary = false ;

    startConstrucor
        .split('')
        .forEach( char => {

            if( endl ) return ;

            if( isInsideCommentary ) {

                if( char === "/" ) {

                    isInsideCommentary = false ;
                }

            } else {

                if( char === "/" ) {

                    isInsideCommentary = true ;
                }

                if( char === ")" ) {

                    endl = true ;
                } else {

                    _construct += char ;
                }

            }

        } )
    ;

    _construct = _construct.split('\n').join(' ').split('/').join('').trim() ;

	return _construct;
} ;
