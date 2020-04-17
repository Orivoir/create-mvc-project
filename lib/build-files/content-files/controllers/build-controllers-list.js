const controllers = [] ;

const readSubFolder = folder => {

    folder.items.forEach( item => {

        if( /^classan/i.test( folder[item].constructor.name ) ) {

            readFile( folder[item], item ) ;

        } else {

            readSubFolder( folder[item] ) ;
        }

    } ) ;

} ;

const readFile = (file, filename) => {

    controllers.push( {
        controller: filename.split('.')[0] ,
        path: file.pathFile
    } ) ;

} ;

module.exports = function( annotations ) {

    if(
        typeof annotations !== "object" ||
        annotations === null ||
        !annotations.controller ||
        typeof annotations.controller !== "object" ||
        annotations.controller === null
    ) {

        throw new RangeError("arg1: annotations should be a object") ;
    }

    const controllerFolder = annotations.controller ;

    readSubFolder( controllerFolder ) ;

    return controllers ;
} ;
