apisecuritygame
===============

A simple game that teaches you how to exploit a web API

## Requirements
At a minimum you will need NodeJS.  If you want to run the SQL Injection level you will also need a Postgres Database.

## Installation

Clone the repo and while in the project folder, run the following command:

```
> npm install 
```

## Running:

If you want to just run the game quickly:

```
> node securitygame.js
```

If you want to run the game and make sure it stays up, you can use Forever.js:

```
> npm install -g forever
> forever start -a securitygame.js
```

## Known Issues
The SQL Injection level requires data in the postgres database with a pointer to the next level.  For now you will need to manually create the table and rows.  
