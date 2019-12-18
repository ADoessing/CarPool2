const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports.index = (loggedin, callback) => {
    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)
    callback(viewRenderer.render('createPool', {loggedin: loggedin}))
}

module.exports.createPool = (loggedin, userid, data, callback) => {
    let title = data.title;
    let text = data.description;
    let from = data.fromDestination;
    let to = data.toDestination;

    let modelPath = path.join(__dirname, '../model/posts.js');
    let model = require(modelPath);

    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)

    let result = model.savePost(title, text, from, to, userid, (success) => {
        if (success) {
            callback(true)
        } else {
            let htmlRendered = viewRenderer.render('createPool', {loggedin: loggedin});
            callback(false, htmlRendered)
        }    
    });
}