/*
* DooMissO node end database class
* created by Kagashino 2017.7.17
*/
function DataBase(config){
	const mysql = require('mysql'),
		  conn = mysql.createConnection(config);
	conn.connect();
	// this.connection = conn;
	this.close = conn.end;
	this.prom = sql=>new Promise((resolve,reject)=>{
		console.log("SQL:::",sql);
		conn.query(sql, (err, rows, field)=>{
			if (err){
				reject(err);
				return;
			};
			resolve(rows,field);
		});
	});
}

DataBase.prototype = {
	/*
	 * add one line;
	 */
	add(table,keys,values){
		if(!(values instanceof Array || values instanceof String)){
			throw new TypeError('values must be String or Array');
		}
		let sql = `INSERT INTO ${table} (${keys.toString()}) VALUES (${values.toString()})`
		return this.prom(sql);
	},
	/*
	 *@param keys: array or Object exception.
	 * When keys Object format:
	 *{
		row1:[column1],
		row2:[column2],
		row3:[column3],
		...
	 *}
	 *@param values: array exception when typeof keys is Array, format:
	 * keys=[row1,row2,...] values=[column1,column2,...]
	 */
	multiAdd(table,keys,values){

		let sql = '', formatValues = [];
		if(keys instanceof Object && arguments.length === 3){

			let _key = Object.keys(keys).join(','), _val = keys[_key[0]];
			_val.forEach((item,index)=>{
				let row = '('
				for(let i in keys){
					row += keys[i][index] + ",";
				}
				formatValues.push( row.subString(0,row.length-1) + ")" ) 
			});
			sql = `INSERT INTO ${table} (${_key}) VALUES ${formatValues.join(',')} ;`;
		} else if (keys instanceof Array && values instanceof Array){

			formatValues	= values.map( item=>"(" + item.join(',') + ")" );
			sql 			= `INSERT INTO ${table} (${keys.toString()}) VALUES ${formatValues.join(',')} ;`;		
		} else {

			throw new TypeError("Unacceptable type of parameters");
		}
		return this.prom(sql);
	},
	/*
	 *@params (rest): auto match your keywords into operating sentence
	 * Second Non-Condition or Non-Order SQL will treat as column name
	 * Sort SQL is ASC or DESC required
	 * String passed required
	 */
	find(table, ...rest){
		
		let sql = '', col = '*', extra = [];
		if(rest.length){
			rest.forEach((item,index)=>{
				if(!item instanceof String){
					throw new TypeError('String parameters required');
				}
				if(item.match(/=|<|>|BETWEEN|LIKE/i) ){
					extra.unshift( (item.match(/WHERE/i)==null?'WHERE':'' + item) );
				} else if (item.match(/ASC|DESC/i) ){
					extra.push( (!item.match(/ORDER BY/i)==null?'ORDER BY ':'') + item );
				} else if(index===0){
					col = rest[0];
				} else {
					extra.push(item);
				}
			});
		}
		sql = `SELECT ${col} FROM ${table} ${extra.join(' ')};`;
		return this.prom(sql);
	},
	/*
	* @params rest keyword 'WHERE' required
	*/
	update(table, set, ...rest){

		let sql = `UPDATE ${table} SET ${set} `;
		sql += `WHERE ${rest.length?rest.join(' '):1};`;
		return this.prom(sql);
	},
	/*
	 * @param rest: keyword 'WHERE' can be ignored;
	 */
	remove(table,...rest){

		let sql = `DELETE FROM ${table} `;
		if(rest.length){
			if(!rest.toString().match(/where/i)){
				sql += 'WHERE '
			}
			sql += `${rest.join(' ')};`;
		}
		return this.prom(sql);

	},
	/*
	 * pass native SQL directly... it may used most frequently
	 */
	query(sql){

		return this.prom(sql);
	}
}
module.exports = DataBase