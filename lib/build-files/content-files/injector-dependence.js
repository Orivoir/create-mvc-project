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

        const daoName = process.env.DAO_NAME || 'dao' ;

        try {

            if( _packageName === daoName ) {

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

                const message = `dependacies "${_packageName}" , not found for controller: ${controllerName}\ntry > npm install ${_packageName}` ;

                if( /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ) {

                    const colorLog = require('chalk') ;

                    console.log( colorLog.red.bold( message ) ) ;

                } else {


                    console.log( message ) ;
                }

                process.exit() ;
            }
            else {
                // unknow require error
                throw e ;
            }

        }

    } ) ;

    return args ;
} ;
