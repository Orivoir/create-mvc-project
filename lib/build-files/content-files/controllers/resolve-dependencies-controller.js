const fs = require('fs');
const resolvePath = require('path');

const extractConstructorHeader = require('./extract-constructor-header') ;
const extractDependenciesList = require('./extract-dependencies-list') ;

const buildControllersList = require('./build-controllers-list') ;

module.exports = function( annotations ) {

	if(
		typeof annotations !== "object" ||
		annotations === null ||
		annotations instanceof Array
	) {
		throw new RangeError("arg1: annotations, should be a object") ;
	}

	const dependencies = [] ;

	const controllers = buildControllersList( annotations ) ;

	controllers.forEach( controller => {

		const {path} = controller ;

		const controllerContent = fs.readFileSync(
			resolvePath.join(
				path
			) ,
			'utf-8'
		) ;

		const contructorHeader = extractConstructorHeader( controllerContent ) ;

		if( contructorHeader ) {

			// if have define constructor
			const dependenciesList = extractDependenciesList( contructorHeader ) ;

			dependencies.push( {
				controller: controller.controller ,
				list: dependenciesList.filter( d => !!d.length )
			} ) ;
		}

	} ) ;

	return dependencies ;
} ;
