module.exports = function(
    dependencies ,
    controllerName
) {

    const args = [] ;

    const dependence = dependencies.find( d => d.controller === controllerName ) ;

    if( !dependence || !(dependence.list instanceof Array) ) {
        return [] ;
    }

    const normalizePackagename = require('./normalize-package-name') ;

    dependence.list.forEach( _package => {

        const _packageName = normalizePackagename( _package ) ;

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

                if( process['create-mvc-project'].isDev ) {

                    const colorLog = require('chalk') ;

                    console.log( colorLog.red.bold( message ) ) ;

                } else {


                    console.log( message ) ;
                }

				if( process.env.DAO_NAME !== "dao" && _packageName === "dao" ) {

					const messageDaoWarning = `\n\nWarning: you have change the default name of database access object from ./.env file\nif you want access to your dao use "${process.env.DAO_NAME}" as service dependence name` ;

					if( process['create-mvc-project'].isDev ) {

						const colorLog = require('chalk');

						console.log( colorLog.yellow.bold( messageDaoWarning ) ) ;

					}  else {

						console.log( messageDaoWarning ) ;
					}
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
