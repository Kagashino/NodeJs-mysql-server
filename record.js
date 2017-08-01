/*
* DooMissO node end score recording interface
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
const res = {
	'200'	: '获取分数列表成功',
	'401'	: '参数不合法，请检查参数格式',
	'403'	: '服务器拒绝了本次请求',
	'404'	: '未找到相应资源',
	'500'	: '系统错误'
}
const param = {
	Rname	: null,
	Rtime	: null,
	Rscore	: null,
	Rremark	: "\'\'"
}
var println = console.log;
var TS = new DB(config);
var values = Object.keys(param).map(i=>param[i]).join(',');

TS.add('ranking','Rname,Rscore,Rtime,Rremark',values)
	.then(arg=>println("findResult::",arg))
	.then(arg=>TS.query('select * from ranking limit 0,6'))
	.then(arg=>println("query arguments::",arg))
	.then(()=>{
		println("query complete, server will close.")
		TS.close();
	});
// .catch(e=>println('ERROR!',e))