/*
* DooMissO node end interface
* created by Kagashino 2017.7.17
*/
const http = require('http');
const fs = require('fs');
const DB = require('./dbFunction');
const config = {
	host	: 'localhost',
	user	: 'root',
	port	: '3306',
	password: '07712268516',
	database: 'touhouscore'
}
var println = console.log
var TS = new DB(config);
TS.find('ranking','Rscore,Rtime,Rremark','where Rscore>9000','order by Rscore desc')
.then(arg=>println("findResult::",arg))
.then(arg=>{
	return TS.query('select * from ranking limit 0,6');
}).then(arg=>println("query arguments::",arg))




// .catch(e=>println('ERROR!',e))






