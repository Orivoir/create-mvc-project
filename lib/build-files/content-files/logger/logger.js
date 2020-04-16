const isDev = /^dev(elopment)?$/i.test( process.env.NODE_ENV ) ;

let colorLog = null ;

if( isDev ) {

    try {
        colorLog = require('chalk') ;
    } catch( e ) {

        if( e.code === "MODULE_NOT_FOUND" ) {

            console.log('\nyou should run > npm install chalk --save-dev\nfor a best CLI render\n') ;
        }
    }
}

function logCli( text, color, fontType ) {

    console.log( buildLogCli( text, color, fontType ) ) ;

}

function buildLogCli( text, color, fontType ) {

    if( !colorLog )
        return text ;

    let loggerFx = colorLog[ color ] ;

    if( !!fontType ) {

        loggerFx = loggerFx[ fontType ]
    }

    return loggerFx( text ) ;

}

module.exports = {
    logCli,
    buildLogCli
} ;
