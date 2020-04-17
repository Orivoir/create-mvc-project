const { buildLogCli } = require('./../../mvc-vendor/logger') ;

module.exports = function( onGetDAO = null ) {

    const setupMysql = require('./../../mvc-vendor/setup-mysql') ;

    onGetDAO = onGetDAO instanceof Function ? onGetDAO :( () => undefined ) ;

    setupMysql( {

        onNotConfig: function() {

            console.log( buildLogCli(
                `MySQL config not found check your .env file ` ,  "red", "bold"
            ) ) ;
        } ,

        onTryMysql: function( result ) {

            console.log( buildLogCli( `\nGet version MySQL success\n`, "green", "bold" ) ) ;

            console.log( result[0] ) ;

            console.log( buildLogCli( `\ninject dependence as: "${process.env.DAO_NAME}" from any contructor of a controller\n`, "yellow", "bold") ) ;

            process.exit() ;
        },
        onGetDAO

    } ) ;

} ;
