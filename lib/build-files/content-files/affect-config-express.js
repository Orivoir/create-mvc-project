module.exports = function( router, config ) {

	if( config.uses instanceof Array ) {

		config.uses.forEach( middleware => {

			if( middleware instanceof Function ) {

				router.use( middleware ) ;

			} else if( middleware instanceof Array ) {

				router.use( ...middleware ) ;
			}

		} ) ;
    }

	if( config.sets instanceof Array ) {

		config.sets.forEach( set => {

			if( set instanceof Array ) {

				router.set( ...set ) ;
			}

		} ) ;
	}

} ;
