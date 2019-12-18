module.exports.savePost = (title, text, from, to, userid, callback) => {
    let path = require('path');
    let databaseCore = require(path.join(__dirname, '../core/database.js'));
    const query = 'INSERT INTO posts(title, text, fromLocation, toLocation, userid) VALUES($1, $2, $3, $4, $5)';
    const values = [title, text, from, to, userid];

    databaseCore.connect((client) => {
        client.query(query, values, (err, res) =>{
            client.end();
            callback(res)
        });
    });
}

module.exports.getPosts = (startPost, numberOfPosts, callback) => {
    let path = require('path');
    let databaseCore = require(path.join(__dirname,'../core/database.js'));
    const query = 'SELECT * from posts ORDER BY timestamp DESC LIMIT $1 OFFSET $2';
    const values =[numberOfPosts, startPost];


    databaseCore.connect((client) => {
        client.query(query, values, (err, res) =>{
            let results = res.rows;
            let packagedResults = []
            results.forEach(function(row) {
                let packagedRow = {
                    "title": row.title,
                    "text": row.text,
                    "from": row.fromlocation,
                    "to": row.tolocation,
                    "userid": row.userid,
                    "postid": row.postid
                }
                packagedResults.push(packagedRow)
            });

            client.end();
            callback(packagedResults)
        });
    })
}

module.exports.searchPosts = (from, to, callback) => {
    let path = require('path');
    let databaseCore = require(path.join(__dirname,'../core/database.js'));
    const query = 'SELECT * from posts WHERE tolocation = $1 AND fromlocation = $2 ORDER BY timestamp DESC';
    const values = [to, from];

    databaseCore.connect((client) => {
        client.query(query, values, (err, res) =>{
            let results = res.rows;
            let packagedResults = []
            results.forEach(function(row) {
                let packagedRow = {
                    "title": row.title,
                    "text": row.text,
                    "from": row.fromlocation,
                    "to": row.tolocation,
                    "userid": row.userid,
                    "postid": row.postid
                }
                packagedResults.push(packagedRow)
            });

            client.end();
            callback(packagedResults)
        });
    })
}
