module.exports = function( controllerModel, controllerName ) {

    while( controllerModel.indexOf('<CONTROLLER_NAME>') !== -1 ) {

        controllerModel = controllerModel.replace(
            '<CONTROLLER_NAME>' ,
            controllerName
        ) ;
    }

    while( controllerModel.indexOf('<CONTROLLER_NAME|lower>') !== -1 ) {

        controllerModel = controllerModel.replace(
            '<CONTROLLER_NAME|lower>' ,
            controllerName.toLocaleLowerCase()
        ) ;
    }

    return controllerModel ;
} ;
