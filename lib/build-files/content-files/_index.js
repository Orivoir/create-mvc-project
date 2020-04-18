/**
 * entry point of your MVC project
 */

require('./mvc-vendor/read-envfile') ;

process['create-mvc-project'] = {

	isDev: /^dev(elopment)?$/i.test( process.env.NODE_ENV )
} ;

const paramInstall = require('./mvc-vendor/storage-install.json') ;

process.env.DOC_URL = "https://github.com/orivoir/create-mvc-project" ;

const CMP = process['create-mvc-project'] ;
const executeEntryPoint = require('./mvc-vendor/execute-custom-entry-point') ;

let setupMysql = null ;

if( !paramInstall.find( arg => /^no\-(my)?sql$/.test( arg ) ) ) {

	setupMysql = require('./mvc-vendor/setup-mysql') ;
}

const {buildLogCli,logCli} = require('./mvc-vendor/logger') ;


if( paramInstall.find( arg => /^no\-npm$/.test( arg ) ) ) {

	logCli('you cant start project because you have install as `no-npm` project, if you dont debug local files you should re install with not `--no-npm` argument', "red","bold") ;

	process.exit() ;
}

if( CMP.isDev ) {

	// dev started
	logCli("\nstart in development mode\n" , "cyan", "bold" ) ;
	process.env.PORT = 3000 ;
}

setupMysql instanceof Function ?
setupMysql( {
	onGetDAO: function(dao) {

		process['create-mvc-project'].dao = dao ;
	}
} ) : null ;

const
	buildController = require('./mvc-vendor/build-controller') ,
	buildRoutes = require('./mvc-vendor/build-routes') ,
	ClassAnnotation = require('class-annotations')( __dirname ) ,
	writeRoutes = require('./mvc-vendor/write-routes') ,
	resolveDependenciesController = require('./mvc-vendor/resolve-dependencies-controller') ,
	pathResolver = require('path') ,
	fs = require('fs')
;

let router = null ;
if(
	!fs.existsSync(
		pathResolver.join(
			__dirname ,
			'/config/express.config.js'
		)
	)
) {
	console.log('missing: config express file in : ./config/express.config.js') ;
	process.exit() ;

} else {

	const {express,config} = require('./config/express.config') ;

	if( express instanceof Function ) {

		router = express() ;

		if( typeof process.env.ENTRY_POINT_FIRST_TIME === "string" ) {

			const isFound = executeEntryPoint({
				pathFile: process.env.ENTRY_POINT_FIRST_TIME.trim(),
				args: [ express, process['create-mvc-project'] ]
			} ) ;

			if( !isFound ) {

				const message = `entry point to execute before server HTTP running not foun from: "${process.env.ENTRY_POINT_FIRST_TIME}", check your "./.env" file` ;

				logCli( message, "red", "bold" ) ;

				process.exit() ;
			}
		}

		if( !!process['create-mvc-project'].isDev ) {

			router.get( /^\/(wos)\/?$/i , ( request, response ) => {

				response.status( 200 ) ;

				response.type('html') ;

				response.sendFile(
					pathResolver.resolve( __dirname, './mvc-vendor/WOS/index.html' )
				) ;

			} ) ;

			router.get('/wos/run/:command' , ( request, response ) => {

				const {command} = request.params ;

				const {execSync} = require('child_process') ;

				const output = execSync( `node ./bin/console ${command}` , {
					cmd: __dirname,
					encoding: "utf8"
				} ) ;

				console.log( buildLogCli( "[exec from browser]", "cyan","bold") ) ;

				console.log( output ) ;

				response.json( {
					"output": output,
					"command": command
				} ) ;

			} ) ;
		}

	} else {

		logCli('requirement: `config.express.js`, should be return, express', "red", "bold" ) ;
		process.exit() ;
	}

	const affectConfigExpress = require('./mvc-vendor/affect-config-express') ;

	affectConfigExpress( router, config ) ;
}

const server = require('http').Server( router ) ;

const annotations = new ClassAnnotation('./src/controller/') ;

const routes = buildRoutes( annotations ) ;

const dependencies = resolveDependenciesController( annotations ) ;

const controllers = buildController( router , routes , dependencies ) ;

writeRoutes( routes ) ;

router.use( function( request, response,next ) {

	// catch 404

	const path404 = pathResolver.join(
		__dirname ,
		`/mvc-vendor/${request.url === "/" && /^dev(elopment)?$/i.test(process.env.NODE_ENV) ? "home-":""}404.html`
	) ;

	response.status( 404 ) ;

	response.type('html') ;

	response.sendFile( path404 ) ;

} ) ;

const startHTTP = function() {

	const httpListener = server.listen( process.env.PORT, () => {

		const addr = httpListener.address() ;

		const startMessage = `\nApp running go check: http://127.0.0.1:${addr.port}/` ;

		if( CMP.isDev ) {

			console.log( buildLogCli( startMessage, "cyan", "bold" ) ) ;

		} else {

			console.log( startMessage ) ;
		}

		if( typeof process.env.ENTRY_POINT === "string" ) {

			const isFound = executeEntryPoint({
				pathFile: process.env.ENTRY_POINT.trim(),
				args: [ httpListener, server, router ]
			} ) ;

			if( !isFound ) {

				const message = `error: entry point file define from .env not found with: ${process.env.ENTRY_POINT}` ;

				console.log( buildLogCli( message, "red", "bold" ) ) ;

				process.exit() ;
			}

		}

	} ) ;
} ;

startHTTP() ;
