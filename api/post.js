const cheerio = require('cheerio')
const superagent = require('superagent');
const BASE_URL = 'https://keylol.com/'

module.exports = (params, query) => {
    let postlist = []
    console.log(params, query);
    return new Promise((resolve, reject) => {
        superagent.get(BASE_URL + params['t'])
            // .query({view:params['view']})
            .set({
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            })
            .end((err, res) => {
                if (err) {
                    return err;
                }
                let $ = cheerio.load(res.text);
                console.log($.text());
                resolve($.text())
            })
    })
}