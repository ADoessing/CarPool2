const ejs = require('ejs');
const fs = require('fs');
const path = require('path');


module.exports.index = (loggedin, callback) =>{
    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)
    callback(viewRenderer.render('createUser', {loggedin: loggedin}))
}

module.exports.createUser = (loggedin, data, callback) => {
    let email = data.email;
    let password = data.password;
    let password_repeat = data.password_repeat;
    let username = data.username;

    let modelPath = path.join(__dirname, '../model/users.js');
    let model = require(modelPath);

    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)

    if (password === password_repeat){
        let result = model.saveUser(username, email, password, (success) => {
            if (success) {
                callback(true)
            } else {
                let htmlRendered = viewRenderer.render('createUser', {loggedin: loggedin});
                callback(false, htmlRendered)
            }    
        });
    } else {
        callback(false, htmlRendered)
    }
}