const logColor = require('chalk') ;

console.log(
    logColor.red.bold("not use: create-mvc-project outside global command\n")
) ;

console.log(
    logColor.cyan.bold("> npm install create-mvc-project --global\n")
) ;

console.log(
    logColor.cyan.bold("> create-mvc-project hello-world")
) ;

console.log(
    logColor.green.bold("\nenjoy !\n")
) ;

process.exit( null ) ;
