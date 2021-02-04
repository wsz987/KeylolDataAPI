const express = require('express')
const router = express.Router()

// 主页抓取
router.all('/index', async (req, res) => {
    const data = await require('../api/index')
    res.status(200).json(data)
})

// 导读 tarBar-listItem
router.all('/view/:view/', async (req, res) => {
    const data = await require('../api/view')(req.params, req.query)
    res.json(data)
})

// 帖子
router.all('/post/:t', async (req, res) => {
    const data = await require('../api/post')(req.params)
    res.send(JSON.stringify(data))
})

// 版块列表
// router.all('/forumlist', async (req, res) => {
    //数据抓取 JSON写入
    // const data = await require('../api/forumlist')
    //JSON 读取
    // const data = await require('../api/readFile_forumlist')
    // res.json(data)
// })

// 主题列表
router.use('/subtypes/:fid', async (req, res) => {
    const data = await require('../api/subtypes')({
        fid: req.params['fid'],
        typeid: req.query['typeid'],
        page: req.query['page']
    })
    res.json(data)
})

module.exports = router;