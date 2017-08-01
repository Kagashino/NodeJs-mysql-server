/*
* DooMissO node end interface
* created by Kagashino 2017.7.17
*/

module.exports = {
	//Covert Params into SQL sentence
	proccessFindArgs(param){
		
		return ['ranking','Rname,Rscore,Rtime,Rremark',`order by ${param.order[0]} ${param.order[1]}`,`limit ${ (param.pgIdx-1)*param.pgSz },${param.pgSz}`];
	},
	proccessRecordArgs(param){
		var _sd = param.ScoreData;
		return [['Rname','Rscore','Rtime','Rremark'],[_sd.Rname,_sd.Rscore,_sd.Rtime,_sd.Rremark]];
	},
	execute(type,values,callback){

		const	DB = require('./dbFunction');
				config = {
					host	: 'localhost',
					user	: 'root',
					port	: '3306',
					password: '07712268516',
					database: 'touhouscore'
				};
				println = console.log,
				TS = new DB(config),
				param = {
					pgSz	: 50,
					pgIdx	: 1,
					order	: 'desc'
				};
		if(!type in DB.prototype){
			throw new TypeError(`No query mehtod name '${type}'`);
		}

		TS[type](...values).then((row,field)=>{
			callback && callback(row,field);
		}).then(()=>{
			println("query complete, server will close.")
			TS.close();
		});
	}
}

		



// TS.find('ranking',
// 		'Rname,Rscore,Rtime,Rremark',
// 		`limit ${(param.pgIdx-1) * param.pgSz},${param.pgSz}`,
// 		`order by Rscore ${param.order}`
// 	).then((row,field)=>{
// 		println()
// 		println("query complete, server will close.")
// 		TS.close();
// 	});
// .catch(e=>println('ERROR!',e))
/*
/*

*/


