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

        const _packageName = _package.replace('Package','').trim() ;

        try {

            if( /^(dao|mysql|orm)$/i.test(_packageName) ) {

				const dao = process['create-mvc-project'].dao ;

                if( dao ) {
                    // user ask database access object as dependence

                    args.push( dao ) ;

                } else {

                    console.log(`you have not config database access object but you have ask as dependence from controller: ${controllerName} , please check your: .env , file`) ;

                    process.exit() ;
                }

            } else {

                args.push ( require( _packageName ) ) ;
            }

        } catch( e ) {

            if( e.code === "MODULE_NOT_FOUND" )  {

                const message = `dependacies "${_package.replace('Package','').trim()}" , not found for controller: ${controllerName}\ntry > npm install ${_packageName}` ;

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
