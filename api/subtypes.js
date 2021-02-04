const cheerio = require('cheerio')
const superagent = require('superagent');
const BASE_URL = 'https://keylol.com/forum.php?mod=forumdisplay&filter=typeid&mobile=2'

module.exports = ({
    fid,
    typeid,
    page
}) => {
    console.log(fid, typeid, page);
    let threadlist = [],
        subtypes = []
    return new Promise((resolve, reject) => {
        // * 贪婪 *? 非贪婪
        // \S 任何非空白字符
        // ? 零次或一次
        // \w 匹配字母、数字、下划线。等价于 [A-Za-z0-9_]
        if (/f(\S*?)-/.test(fid)) {
            page = fid.split('-')[1]
            fid = fid.match(/f(\w+?)-/)[1]
        }
        superagent.get(BASE_URL)
            .query({
                fid,
                typeid,
                page
            })
            .set({
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            })
            .end((err, res) => {
                if (err) {
                    return err;
                }
                let $ = cheerio.load(res.text);
                $('.subtypes a').each(function (index, type) {
                    let $type = $(type)
                    if (!/typeid=(\S*?)&/.test($type.attr('href'))) return
                    subtypes.push({
                        filterName: $type.text(),
                        typeid: $type.attr('href').match(/typeid=(\S*?)&/)[1]
                    })
                })
                $('.threadlist li').each((index, el) => {
                    let $el = $(el),
                        imgSrc = []
                    $el.find('.subject img').each((index, Img) => {
                        let $Img = $(Img).attr('srcset') || $(Img).attr('data-srcset') || $(Img).attr('src')
                        if ($Img !== undefined)
                            imgSrc.push($Img)
                    })
                    threadlist.push({
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
                // resolve(subtypesList)
                resolve({
                    subtypes,
                    threadlist
                })
            })
    })
}