const cheerio = require('cheerio')
const superagent = require('superagent');
const BASE_URL = 'https://keylol.com/forum.php?mod=guide&mobile=2'
module.exports = (params,query) => {
    let list = []
    console.log(params,query);
    return new Promise((resolve, reject) => {
        superagent.get(BASE_URL)
        .query({view:params['view']})
        .query({page:query['page'] || 1})
            .set({
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            })
            .end((err, res) => {
                if (err) {
                    return err;
                }
                let $ = cheerio.load(res.text);
                $('.hotlist li').each((index, el) => {
                    let $el = $(el),
                        imgSrc = []
                    $el.find('.subject img').each((index, Img) => {
                        let $Img = $(Img).attr('srcset') || $(Img).attr('data-srcset') || $(Img).attr('src')
                        if ($Img !== undefined)
                            imgSrc.push($Img)
                    })
                    list.push({
                        index: index,
                        title: $el.find('div.a').text().trim(),
                        href: $el.find('a').attr('href'),
                        fontStyle: $el.find('div.a').attr('style') || '',
                        content: $el.find('p').text().trim(),
                        imgSrc: imgSrc,
                        time: $el.find('time').text(),
                        perGroup: $el.find('.perGroup').text(),
                        user: $el.find('.timeT a').text(),
                        userHref: 'https://keylol.com/' + $el.find('.timeT a').attr('href'),
                        userAvatar: $el.find('.perImg img').attr('src'),
                        viewNum: $($el.find('.y a')[0]).text(),
                        msgNum: $($el.find('.y a')[1]).text(),
                    })
                })
                resolve(list)
            })
    })
}