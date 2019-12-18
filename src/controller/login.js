const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports.index = (loggedin, callback) => {        
    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)
    callback(viewRenderer.render('login', {loggedin: loggedin}))
}

module.exports.login = (loggedin, data, callback) => {
    let email = data.email;
    let pW = data.password;

    let modelPath = path.join(__dirname, '../model/users.js');
    let model = require(modelPath);

    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)

    let result = model.authUser(email, pW, (success, userid) => {
        if (success) {
            let htmlRendered = viewRenderer.render('index', {loggedin: loggedin});
            callback(htmlRendered, true, userid)
        } else {
            let htmlRendered = viewRenderer.render('login', {loggedin: loggedin});
            callback(htmlRendered, false)
        }    
    });
}