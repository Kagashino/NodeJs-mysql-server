/*
* DooMissO node end interface
* created by Kagashino 2017.7.31
*/
const   http = require('http');
        express = require('express'),
        bodyParser = require('body-parser'),
        query = require('./query');
        println = console.log,
        port = 52049,
        app = express(),
        server = http.createServer(app)
        .listen(port,()=>console.log("Server listening at localhost:" + port));


app.use(bodyParser.json()); // 转换为 application/json 的MIME
app.use(bodyParser.urlencoded({ extended: true })); // 解析dataType为JSON的请求体
app.set('view engine', './');

app.get('/', (req, res) => {

    res.render('./ranking.ejs');

}).post('/test', (req, res) => {

    const param = req.body;
    const callback = (row,field)=>{
        println("查询成功！");
        res.json(row);
    };
    query.execute('find', query.proccessFindArgs(param), callback);

}).post('/exam', (req, res) => {

    console.log(req.body);
    res.send("这里是请求结果");

});




