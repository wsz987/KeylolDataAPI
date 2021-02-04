# KeylolDataAPI
> 数据抓取基于 [keylol 移动端](https://keylol.com/forum.php?m=index&mobile=2) 页面
>
> **不涉及任何权限帖子 & 版块内容**  单纯列表抓取 不抓取任何帖子内容 -- 其实我不会φ(*￣0￣) 守株待兔逮个大佬
>
> > 接口基于对应请求 **一对一页面抓取**  不会对论坛服务器照成负载  **但请不要 频繁 & ''过分'' 请求造成 论坛502**
>
> **此仓仅供学习** -- Node小白 这接口顶多做个列表数据渲染
>
> 请勿恶意使用 如有侵权   请联系论坛ID: wsz987 -- Github这边不常看
>
> ♥ GAY坛

#### 技术栈

- [Express框架](https://www.expressjs.com.cn/)
- [Cheerio中文](https://github.com/cheeriojs/cheerio/wiki/Chinese-README)
- [Superagent](https://www.npmjs.com/package/superagent)

#### 依赖安装

```
npm i || npm install
```

#### 启动

```
node app
// 热更新模式 
nodemon app
```

#### 端口配置

```
var hostName = '127.0.0.1'
var port = process.env.PORT || 80
app.listen(port, () => {
    console.log(`服务器运行在 http://${hostName}:${port}`);
})
```

#### 项目结构

```
├─.gitignore
├─app.js        // 启动文件
├─logger.js     // 日志打印 mothod & url
├─package-lock.json       
├─package.json
├─src           // 静态文件 版块列表JSON 
|  └forumlist.json        
├─router        // 路由
|   └router.js
├─api           // 爬虫脚本
|  ├─forumlist.js            // 论坛非权限版块列表 (固定内容不需要频繁抓取)
|  ├─index.js                // 主页内容
|  ├─post.js                 // 帖子内容 (只有结构 无抓取代码 已声明不做任何抓取--实际不会 抓取效果不好)
|  ├─readFile_forumlist.js   // 读取静态文件 版块列表JSON 
|  ├─subtypes.js             // 版块内容列表
|  └─view.js                 // 导读版块 tabBar列表
```

#### 请求头注意项

```
'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
```

#### 版块列表 默认返回静态JSON

**app.js**

```
// 版块列表
app.use('/api/forumlist/',express.static('./src/forumlist.json'))
```
**router.js**

```
// 版块列表
// router.all('/forumlist', async (req, res) => {
    //数据抓取 JSON写入
    // const data = await require('../api/forumlist')
    //JSON 读取
    // const data = await require('../api/readFile_forumlist')
    // res.json(data)
// })
```

#### 接口参数

> 后端不做限制 API请求 router.all()

```
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS')
    res.header('X-Powered-By', 'nodejs')
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})
```

#### 接口路径

> [**主页**](https://keylol.com/forum.php?m=index&mobile=2) (无参)

```
/api/index
```

> [**导读**](https://keylol.com/forum.php?mod=guide&view=hot&mobile=2)
>
> 最新热门; hot
>
> 最新精华: digest
>
> 最新发表: newthread
>
> 最新回复: new
>
> 最新沙发: sofa
>
> `page` 不带的话默认第一页

```
/api/view/:view?page=1
```

> [**版块列表**](https://keylol.com/forum.php?forumlist=1&mobile=2) (无参)

```
/api/forumlist
```

> **帖子**  (只是有个路径) 例: t682753-1-1

```
/api/post/:t
```

> [**版块内容列表**](https://keylol.com/f148-1)
>
> `fid`  支持俩格式  `/api/subtypes/f123-1`  **等效**于 `/api/subtypes/123?page=1`
>
> `typeid` 分类  **默认不带 = 返回全部内容**  ( 参见接口返回`subtypes`信息 )
>
> `page` 默认第一页

```
/api/subtypes/:fid?typeid=&page=1

{
    subtypes: [],
    threadlist: []
}
```

#### 其他详细信息请查看返回JSON 无状态码返回 默认 status=200

