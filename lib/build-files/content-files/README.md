# content-files folder

## This folder contains local files generate by **create-mvc-project** during install

- [/CLI](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/CLI)

contains source of **Command Line Interface** integrate with **create-mvc-project**


- [/EJS](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/EJS)

contains static source **EJS template file** while context install *outside*: **--no-ejs**


- [/NO-EJS](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/NO-EJS)

contains static source replace **EJS template** while context install *inside*: **--no-ejs**


- [/SQL](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/SQL)

contains source config **MySQL** and handler **errors authentication SQL**

- [/NO-SQL](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/NO-SQL)

**NO-SQL** folder is not **Not Only SQL** for replace context **MySQL**,
contains config files excludes by install context: **--no-sql** or **no-mysql**

> currently **create-mvc-project** support only MySQL as handler SQL and considerate **SQL** as reference to **MySQL**


- [/controllers](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/controllers)

contains source of **service dependence controller**


- [/router](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/router)

contains source define routes during **npm start** and build routes
during:

> node ./bin/console router [controllername --option]


- [/models](https://github.com/Orivoir/create-mvc-project/tree/master/lib/build-files/content-files/models)

contains model **txt** build from **CLI** during build new controller
