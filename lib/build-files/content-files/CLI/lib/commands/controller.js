const pathResolver = require('path') ;
const { buildLogCli } = require('./../../mvc-vendor/logger') ;
const fs = require('fs') ;

module.exports = function( args ) {

    let controllerName = args[1] ;

    const buildModelController = require('./../../mvc-vendor/build-model-controller') ;
    const buildViewController = require('./../../mvc-vendor/build-view-controller') ;

    if(
        !!controllerName &&
        /^[a-z]{1}[a-z\d\_\-]{0,254}$/i.test( controllerName )
    ) {

        controllerName = controllerName.trim() ;

        const pathController = pathResolver.join(
            __dirname , './../../src/controller' , ( controllerName + ".js" )
        ) ;

        if( fs.existsSync( pathController ) ) {

            console.log(
                buildLogCli(
                    `"${controllerName}" , already exists in: ./src/controller` , "red", "bold"
                )
            ) ;

            process.exit() ;

        } else {

            console.log(
                buildLogCli(
                    `append: ${controllerName}` , "cyan", "bold"
                )
            ) ;

            const isJsonController = ( typeof args[2] === "string" &&
                    /^(\-\-?)(json|api|no\-?(template|tpl))$/i.test(args[2].trim())
            ) ;

            let controllerModel = fs.readFileSync(
                pathResolver.join(
                    __dirname , `./../../mvc-vendor/controller-model-${isJsonController ? "json":"template"}`
                ) ,
                'utf-8'
            ) ;

            controllerModel = buildModelController( controllerModel,controllerName ) ;

            fs.appendFileSync(
                pathController ,
                controllerModel ,
                "utf-8"
            ) ;

            console.log(
                buildLogCli(
                    `\ncontroller has been created: "./src/controller/${controllerName}.js"` , "green", "bold"
                )
            ) ;

            if( !isJsonController ) {

                buildViewController( controllerName ) ;
            } else {

                console.log(
                    buildLogCli(
                        `\nJSON controller has been created with success\n`, "green", "bold"
                    )
                ) ;
            }
        }

    } else {

        console.log(
            buildLogCli(
                `"${controllerName}" , is not a valid controller name` , "red", "bold"
            )
        ) ;

        process.exit() ;
    }

} ;
