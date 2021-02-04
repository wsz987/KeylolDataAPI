const cheerio = require('cheerio')
const superagent = require('superagent');
const fs = require('fs')
const BASE_URL = 'https://keylol.com/forum.php?forumlist=1&mobile=2'

module.exports = new Promise((resolve, reject) => {
    let forumlist = [],
        catlist = []
    superagent.get(BASE_URL)
        .set({
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        })
        .end((err, res) => {
            if (err) {
                return err;
            }
            let $ = cheerio.load(res.text);
            $('.catlist span').each((index, el) => {
                // 我的关注
                if (index === 0) return
                catlist.push($(el).text())
            })
            $('.forumlist ul').each((index, el) => {
                // 我的关注
                if (index === 0) return
                let $forum = $(el),
                    children = []
                $forum.children('li').each((index, el) => {
                    let $item = $(el)
                    children.push({
                        index,
                        forumname: $item.find('img').attr('alt'),
                        href: $item.find('.icon a').attr('href'),
                        icon: 'https://keylol.com/' + $item.find('img').attr('src').split('/../../../')[1]
                    })
                })
                console.log(children);
                forumlist.push({
                    index,
                    navName: catlist[index - 1],
                    children
                })
            })
            resolve(forumlist)
            // 版块列表JSON写入
            // fs.writeFile('src/forumlist.json',
            //     JSON.stringify(forumlist, "", "\t"),
            //     err => {
            //         if (err) throw err
            //     })
        })
})