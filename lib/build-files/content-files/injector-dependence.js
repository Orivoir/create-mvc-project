module.exports = function(
    dependencies ,
    controllerName
) {

    const args = [] ;

    const dependence = dependencies.find( d => d.controller === controllerName ) ;

    if( !dependence || !(dependence.list instanceof Array) ) {
        return [] ;
    }

    dependence.list.forEach( _package => {

        try {
            args.push ( require( _package.replace('Package','').trim() ) ) ;

        } catch( e ) {

            if( e.code === "MODULE_NOT_FOUND" )  {

                const message = `dependacies "${_package.replace('Package','').trim()}" , not found for controller: ${controllerName}\ntry > npm install ${_package.replace('Package','').trim()}` ;

                if( /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ) {

                    const colorLog = require('chalk') ;

                    console.log( colorLog.red.bold( message ) ) ;

                } else {


                    console.log( message ) ;
                }

                process.exit() ;
            }
            else {

                throw e ;
            }

        }

    } ) ;

    return args ;
} ;
