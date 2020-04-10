const fs = require('fs');
const resolvePath = require('path');

const extractConstructorHeader = content => {

	content = content.split('\n').map( l => l.trim() ).filter( l => !!l.length ) ;

	let isOpen = false ;

	let lineOpen = null;
	let lineClose = null ;

	content.forEach( (line,key) => {

		line = line.trim() ;

		if( lineOpen != null && lineClose != null ) return ;

		if( !!isOpen ) {

			if( line.indexOf(')') !== -1 ) {
				lineClose = key ;
			}
		} else {

			if( /^constructor.*/.test( line ) ) {
				isOpen = true ;
				lineOpen = key ;

				if( line.indexOf(')') !== -1 ) {
					lineClose = key+1 ;
				}
			}
		}

	}  ) ;

	if( !isOpen ) {

		return null;
	}

	return content.slice( lineOpen , lineClose ) ;

} ;

const extractDependenciesList = headerConstructor => {

	headerConstructor = headerConstructor.join('');

	const opened = headerConstructor.indexOf('(') ;

	let closed = null ;

	if( headerConstructor.indexOf(')') !== -1 ) {

		closed = headerConstructor.indexOf(')') ;
	}

	const innerHeaderConstructor = headerConstructor.slice( opened+1 , closed ).trim() ;

	return innerHeaderConstructor.split(',') ;

} ;

module.exports = function( annotations ) {

	const controllers = annotations.controller.items.map( item => item.split('.')[0] ) ;

	const dependencies = [] ;

	controllers.forEach( controllerName => {

		const controllerContent = fs.readFileSync(
			resolvePath.join(
				__dirname ,
				'./../src/controller' ,
				( controllerName + '.js' )
			) ,
			'utf-8'
		) ;

		const contructorHeader = extractConstructorHeader( controllerContent ) ;

		if( contructorHeader ) {

			// if have define constructor
			const dependenciesList = extractDependenciesList( contructorHeader ) ;

			dependencies.push( {
				controller: controllerName ,
				list: dependenciesList.filter( d => !!d.length )
			} ) ;
		}


	} ) ;

	return dependencies ;

} ;
