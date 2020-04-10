# This file is the first prototype of the documentation of this project

Please if you detect a error inside documentation or if you have
a best precision of english langague push a pull request or open
a new [issue](https://github.com/Orivoir/create-mvc-project/issues/new)

# [create-mvc-project](https://github.com/Orivoir/create-mvc-project)

> build your will flexible new project with a standard model view controller structure and enjoy with integrate console, make yourcontroller in one command , define your route with annotations and other...

## table content

- [installation](#installation)

- [create new project](#create-new-project)

- [controller](#controller)
    - [make controller](#make-controller)
    - [routes](#routes)
    - [service dependence](#service-dependence)

- [console](#console)
    - [make controller CLI](#make-controller-cli)
    - [debug router CLI](#debug-router-cli)
    - [debug mysql CLI](#debug-router-cli)

- [env](#env)
    - [mysql](#mysql)
    - [custom entry point](#custom-entry-point)

- [config](#config)
    - [express](#express)

- [templating](#templating)

- [currently state of project](#currently-state-of-project)

## [installation](https://www.npmjs.com/package/create-mvc-project)

> npm install create-mvc-project --global

> yarn global add create-mvc-project


## create new project

> create-mvc-project hello-world

> cd hello-world

> npm start


## controller

your controller folder at: **./src/controller/**

your project is init with **Main** controller

**Main** controller is not essential to your new project, but you can examine the code before removed for understand the global structure of any controller.

### make controller

For create manually an new controller you should give filename exactly equal to your
classname export.

*e.g:*
Foo.js
```javascript
class Foo {

    /**
     * @Route({
     *      name: "index",
     *      methods: ["GET"],
     *      path: "/foo/"
     * })
     */
    index( request, response ) {

        response.status( 200 ) ;

        response.type('html') ;

        response.render('foo/index', {

            controller: 'Foo'
        } ) ;
    }

} ;

module.exports = Foo ;
```

But you can automate task of create a new **controller** with the console [console](#make-controller-cli)

### routes

If you have examine the **controller** generate with your new project *( ./src/controller/Main.js )* , you can will have see the routes are defined from **annotations** at top of *method* associate.

*e.g:*
```javascript
    /**
    * @Route({
    *      name: "index",
    *      methods: ["GET"],
    *      path: "/"
    * })
    */
    index( request, response ) {

        // ...
    }
```

After run HTTP server the route "/" is automatically associate to this method.

#### Warning

you should not write an empty line between your annotation and your method header,
it is this rule that allows the annotation reader to differentiate a simple comment from an annotated method.

*e.g:*
```javascript
    /**
    * @Route({
    *      name: "index",
    *      methods: ["GET"],
    *      path: "/"
    * })
    */


    index( request, response ) {

        // ...
    }
```

the **index** method above is not annoted due empty lines between header method and
annotations, the route **"/"** should response with status 404.

You can to become best friend of the annotations reader integrate [if you want](https://www.npmjs.com/package/class-annotations).

### service dependence

the dependency service allows you to automate the require of your packages from the constructor of your controller.

*e.g:*
```javascript
class Foo {

    constructor( chalk ) {

        this.chalk = chalk ;

        console.log(
            this.chalk.green.bold(
                'i have receveid my dependence with success <3'
            )
        ) ;
    }

} ;

module.exports = Foo ;
```
service dependence is based on the name of package to require, but **he not install package automatically if not found**, for security reason and accessibility.

## console

**create-mvc-project** integrate an **CLI** for [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
the recurring tasks

from the root of your new project you can access to **CLI** with:

> node ./bin/console

should return the **commands list**

### make controller CLI

from **CLI** you can make a new controller with minimal fonctional code

> node ./bin/console controller Foo

- **controller has been created: "./src/controller/Foo.js"**
- **views has been created: "./views/foo/index.ejs"**

if you dont want generate views code you can give the **arg** *--no-template* or *--json*

> node ./bin/console controller Foo --json

- **controller has been created: "./src/controller/Foo.js"**

# debug router CLI

After creating your **controllers** and writing your first **routes** you may need to have an *overview* of your **routes**,
you can ask your **CLI** to show you the list:

> node ./bin/console router

```
method         path         controller

GET         "/main/"         Main.index
GET         "/main/foo"      Main.foo
```

you can ask routes of only specific controller with controller name in **arg 2**

> node ./bin/console router Foo

### debug mysql CLI

if you have config your MySQL database server from [.env file](#env)
you can test **connection** from **CLI**

> node ./bin/console mysql

```
Get version mysql success

RawDataPacket: { 'version()': '<YOUR MYSQL VERSION>' }
```

if you have a error connection **CLI** return a message with a good precision of the error


## env

**create-mvc-project** allows you to easily configure part of your project from a **./.env** file,
currently you can configure a connection to your **MySQL** database and define a custom **entry point** for final configure.

### mysql

you can configure your **MySQL** connexion from **./.env**

```yaml
# currently `create-mvc-project` support only
# package `mysql` from npm
# if you use a another driver SQL
# you should manualy import and config
# from your custom entry point

# your MySQL database config:
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=database
# DB_HOST=127.0.0.1
# DB_PORT=3306


# or connect with database url
# full settings database url: https://www.npmjs.com/package/mysql

# DATABASE_URL=mysql://user:password@host/database?debug=true&charset=utf8
```

you should install **mysql package** from NPM

> npm install mysql --save

and check your connection from [CLI](#debug-mysql-CLI)

after check connection is ok you can acess to your **database access object**
from any controller with use [service depedence](#service-dependence) as **dao** with package name.

do not install **dao** as **package** from **NPM**

**dao** is an special package integrate with **create-mvc-project**
available while MySQL connection is ok.

**from any controller**
```javascript
class Foo {

    constructor( dao ) {

        this.dao = dao ;

        this.dao.query('SELECT NOW()' , function(error,result,fields) {

            if( error ) {

                throw error;
            }

            console.log( result ) ;

        } ) ;
    }

} ;
```

if you have not define config **MySQL** from **./.env** file
you receveid error message:

**package: "dao" , not found, try: npm install dao --save**

but you can skip this message and config your **MySQL** database.

### custom entry point

if you have an final config for your project before start your coding ,
configure connection you database access if you dont use MySQL,
start a TCP/IP server or another...

you can define an entry point will execute after server HTTP running
from: **./.env** file.

```YAML
# if you return function you receveid in arguments:
#   http.Server,
#   net.Server,
#   express.Router
#
# https://nodejs.org/docs/latest-v12.x/api/http.html
# http://expressjs.com/fr/api.html#router

# ENTRY_POINT=./index.js
```

**./index.js**
```javascript
module.exports = function(
    httpListener,
    serverHTTP,
    app // express
) {

    // your final config here
}
```

## config

**create-mvc-project** have defined a folder **/config** at project root
inside you will find the files config understand by **create-mvc-project**
currently you can configure [Express](#express) from: **/config/express.config.js**

### express

(Express)[https://www.npmjs.com/package/express] is the HTTP router integrate by
**create-mvc-project** , but express can be extends beyond of basic HTTP router
with **middleware** system.

You can configure **Express** from: **./config/express.config.js**
by default express load the template [EJS](npmjs.com/package/ejs) and define the **public** directory
as **static directory** but you can re defined **Express** for your needs.

the default configure contains:

**./config/express.config.js**
```javascript
const express = require('express') ;

const config = {

    // define your express middlewares here:
    // http://expressjs.com/en/guide/writing-middleware.html#ecriture-de-middleware-utilisable-dans-les-applications-express

    // your middleware should be an function or an array
    uses: [

        // define the static folder
        [ '/public' , express.static( 'public' ) ] ,

        // request logger
		function( request, response, next ) {

			console.log(`${request.method}\t"${request.url}"`) ;

			// free middleware
			next() ;
		}
    ] ,

    // your setters should be an array ( key, value )
    sets: [

        // https://ejs.co/
        [ 'view engine', 'ejs' ]
    ]

} ;

module.exports = {
    express,
    config
} ;
```

this file should exists for npm start not reject but if you
want config express from an [custom entry point](#custom-entry-point)
you can exports empty object for config.

**./config/express.config.js**
```javascript
const express = require('express') ;

const config = {
    /**
     * config express define from my custom entry point
     */
} ;

module.exports = {
    express,
    config
} ;
```

## templating

**create-mvc-project** install by default [EJS](https://www.npmjs.com/package/ejs) templating
but if you want a another template or if you use only **HTML**
you can give the **arg** **--no-ejs** during **install** command.

> create-mvc-project hello-world --no-ejs


## currently state of project

currently this project is not ready for a first usage from NPM but if you want test the dev version
you can:

> git clone https://github.com/Orivoir/create-mvc-project.git


> create-mvc-project --version

should be return **1.0.0-dev**

> create-mvc-project hi-world

> cd hi-world

> npm start

enjoy & unicorn <3