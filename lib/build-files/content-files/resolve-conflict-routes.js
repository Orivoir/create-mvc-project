/**
 * routes:
 *
 * [
 *  {
 *      name: string, <- should be unique
 *      controller: string,
 *      methods: string[],
 *      methodName: string,
 *      path: string, <- should be unique
 *  }
 * ]
 */

const arrayKeyObjectUniq = require('array-key-object-uniq') ;

const arrayInline = require('array-key-object-uniq/lib/inline-transform') ;

module.exports = function( routes ) {

    if(
        !(routes instanceof Array) ||
        routes.find( route => {

            if( typeof route !== "object" ) {

                return true;
            }

            let error = false ;

            ['name','path','methodName','controller'].forEach( attribute => {

                if(
                    typeof route[ attribute ] !== "string" ||
                    !route[attribute].length
                ) {
                    error = true ;
                }

            } ) ;

            return error ;

        } )
    ) {

        throw RangeError('arg1: routes[], should be a array of routes data') ;
    }

    // here have receveid a valid routes[]

    const routesCheck = routes.map( route => {

        return {

            name: route.name,
            path: route.path,
            controller: ( route.controller + "." + route.methodName )
        } ;

    } ) ;

    return !( arrayKeyObjectUniq( routesCheck ).length === arrayInline( routesCheck ).length ) ;
} ;
