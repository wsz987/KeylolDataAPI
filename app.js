const express = require(`express`)
const bodyParser = require('body-parser')
// const compression = require('compression')
const app = express()

app.use(express.json())
// app.use(compression())

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(require('./logger'))
app.use('/api',require('./router/router'))
// 版块列表
app.use('/api/forumlist/',express.static('./src/forumlist.json'))


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS')
    res.header('X-Powered-By', 'nodejs')
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})

var hostName = '127.0.0.1'
var port = process.env.PORT || 80
app.listen(port, () => {
    console.log(`服务器运行在 http://${hostName}:${port}`);
})