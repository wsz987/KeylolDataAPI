const fs = require('fs')

module.exports= new Promise((resolve, reject)=>{
    fs.readFile('src/forumlist.json','utf-8',function(err,data){
        if(err) throw err
        resolve(JSON.parse(data))
    });
})