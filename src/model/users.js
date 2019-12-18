module.exports.saveUser = (username, email, password, callback) => {
    let path = require('path');
    let databaseCore = require(path.join(__dirname, '../core/database.js'));
    let success = false;
    let encrypter = require(path.join(__dirname,'../../services/encrypter.js'));
    let encryptedPW = encrypter.encrypt(password);

    const query = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3)';
    const values = [username, email, encryptedPW];

    databaseCore.connect((client) => {
        client.query(query, values, (err, res) => {
            if(err == null){
                success = true
            }
            client.end();
            callback(success)
        });
    });
}

module.exports.getUsers = (callback) => {
    let path = require('path');
    let databaseCore = require(path.join(__dirname,'../core/database.js'));
    const query = 'Select * from users';

    databaseCore.connect((client) => {
        client.query(query, (err, res) =>{
            client.end()
            callback("This is user, yes?")
        });
    });
}

module.exports.authUser = (email, password, callback) => {
    let path = require('path');
    let databaseCore = require(path.join(__dirname,'../core/database.js'));
    let success = false;
    let encrypter = require(path.join(__dirname,'../../services/encrypter.js'));
    const query = 'SELECT password, userid from users where email=$1';
    const values = [email];

    databaseCore.connect((client) => {
        client.query(query, values, (err, res) =>{
            if (res.rows.length > 0 && encrypter.decrypt(res.rows[0].password)===password){
                success = true;
                let userid = res.rows[0].userid
                client.end();
                callback(success, userid)
            } else {
                client.end();
                callback(success)
            }
        });
    })
}
