const readOneFile = require('./read-file-item') ;

module.exports = function( directory, routes ) {

	const items = directory.items ;

	items.forEach( item => {

		const objectItem = directory[ item ] ;

		if( /classannotation/i.test( objectItem.constructor.name ) ) {

			readOneFile(
				objectItem ,
				routes
			) ;

		} else {
			readOneDirectory( objectItem ) ;
		}

	} ) ;
} ;
