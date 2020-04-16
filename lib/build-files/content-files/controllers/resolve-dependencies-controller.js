const fs = require('fs');
const resolvePath = require('path');

const extractConstructorHeader = require('./extract-constructor-header') ;
const extractDependenciesList = require('./extract-dependencies-list') ;

module.exports = function( annotations ) {

	if(
		typeof annotations !== "object" ||
		annotations === null ||
		annotations instanceof Array
	) {
		throw new RangeError("arg1: annotations, should be a object") ;
	}

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
