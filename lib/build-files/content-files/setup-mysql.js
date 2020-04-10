module.exports = function( {
    onTryMysql ,
    onGetDAO ,
    onNotConfig
} ) {

    if (
        ( typeof process.env.DB_USER === "string" &&
        typeof process.env.DB_PASSWORD === "string" &&
        typeof process.env.DB_NAME === "string" &&
        typeof process.env.DB_PORT === "string" &&
        typeof process.env.DB_HOST === "string" ) ||
        typeof process.env.DATABASE_URL === "string"
    ) {

        const mysql = require('./mvc-vendor/mysql-config') ;

        const dao = mysql({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            host: process.env.DB_HOST
        } , onTryMysql ) ;

        onGetDAO instanceof Function ?
            onGetDAO( dao ): null
        ;
    } else {

        onNotConfig instanceof Function ? onNotConfig(): null ;
    }
}