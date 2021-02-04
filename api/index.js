const cheerio = require('cheerio')
const superagent = require('superagent');
const BASE_URL = 'https://keylol.com/forum.php?m=index&mobile=2'
let tempWrap = [],
    tjbk = [],
    toutiao = [],
    newthreads = [],
    newreplies = []
module.exports= new Promise((resolve, reject) => {
    superagent.get(BASE_URL)
    .set({
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    })
    .end((err, res) => {
        if (err) {
            return err;
        }
        let $ = cheerio.load(res.text);
        // 轮播图
        $('#focus a').each((index, el) => {
            let $el = $(el)
            tempWrap.push({
                index: index,
                title: $el.attr('title'),
                href: $el.attr('href'),
                imgSrc: $el.find('img').attr('data-srcset') || $el.find('img').attr('srcset')
            })
        })
        // 推荐版块
        $('#tjbk1 a').each((index, el) => {
            let $el = $(el)
            tjbk.push({
                index: index,
                title: $el.find('img').attr('alt'),
                subtitle: $el.find('p').text(),
                href: $el.attr('href'),
                imgSrc: 'https://keylol.com/' + $el.find('img').attr('src').split('/../../../')[1]
            })
        })
        // 头条
        $('#toutiao li').each((index, el) => {
            let $el = $(el)
            toutiao.push({
                index: index,
                forumname: $el.find('span').text() || '',
                title: $el.find('font').text() || $el.find('a').text(),
                summary: $el.find('summary').text() || '',
                href: $el.find('a').attr('href'),
                time: $el.find('em').text() || '',
                fontStyle: $el.find('font').attr('style') || ''
            })
        })
        // 最新主题
        $('#newthreads ul li').each((index, el) => {
            let $el = $(el)
            newthreads.push({
                index: index,
                title: $el.find('font').text() || $el.find('a').text(),
                href: $el.find('a').attr('href'),
                time: $el.find('em').text() || '',
                fontStyle: $el.find('font').attr('style') || ''
            })
        })
        // 最新回复
        $('#newreplies ul li').each((index, el) => {
            let $el = $(el)
            newreplies.push({
                index: index,
                title: $el.find('font').text() || $el.find('a').text(),
                href: $el.find('a').attr('href'),
                time: $el.find('em').text() || '',
                fontStyle: $el.find('font').attr('style') || ''
            })
        })
        resolve({
            tempWrap,
            tjbk,
            toutiao,
            newthreads,
            newreplies
        })
    })
})