// const logColor = require('chalk') ;

// console.log(
//     logColor.red.bold("not use: create-mvc-project outside global command\n")
// ) ;

// console.log(
//     logColor.cyan.bold("> npm install create-mvc-project --global\n")
// ) ;

// console.log(
//     logColor.cyan.bold("> create-mvc-project hello-world")
// ) ;

// console.log(
//     logColor.green.bold("\nenjoy !\n")
// ) ;

// process.exit( null ) ;
















const chalk = require('chalk');
const Ora = require('ora');

const spinner = new Ora({
	discardStdin: false,
	text: chalk`{green Loading} unicorns, not discarding stdin`,
    spinner: {
        "frames": [
            "⠋",
            "⠙",
            "⠹",
            "⠸",
            "⠼",
            "⠴",
            "⠦",
            "⠧",
            "⠇",
            "⠏"
        ]
    }
});


// let spinnerID = setInterval(() => {
//     spinner.render() ;
// }, 100);

// spinner.succeed();

const startSpinAt = Date.now() ;

const endEventLoopTurn = again => {

    return () => {

        spinner.render() ;

        if( !!again ) {

            listenEndNextEventLoopTurn() ;
        }
    } ;
} ;

const listenEndNextEventLoopTurn = () => {

    const again = ( Date.now() - startSpinAt <= 2e3 ) ;

    process.nextTick( endEventLoopTurn( again ) ) ;

} ;

listenEndNextEventLoopTurn() ;

// spinner.start();
// setTimeout(() => {
// }, 100);

// setTimeout(() => {
// 	spinner.color = 'yellow';
// 	spinner.text = `Loading ${chalk.red('rainbows')}`;
// }, 4000);

// setTimeout(() => {
// 	spinner.color = 'green';
// 	spinner.indent = 2;
// 	spinner.text = 'Loading with indent';
// }, 5000);

// setTimeout(() => {
// 	spinner.indent = 0;
// 	spinner.spinner = 'moon';
// 	spinner.text = 'Loading with different spinners';
// }, 6000);

// setTimeout(() => {

//     console.log('\nhi world\n')
// }, 500);

// setTimeout(() => {
//     // clearInterval( spinnerID ) ;
// }, 2e3 ) ;
