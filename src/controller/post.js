const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports.index = (loggedin,callback) => {
    showPosts(loggedin, 1, callback);
}

module.exports.showPosts = (loggedin, pageNumber, callback) => {
    if (typeof pageNumber !== 'number'){
        pageNumber = 1;
    }

    let postsPerPage = 10;
    let modelPath = path.join(__dirname, '../model/posts.js');
    let model = require(modelPath);
    model.getPosts((pageNumber-1)*postsPerPage, postsPerPage, (dataArray) => {
        let viewPath = path.join(__dirname, '../views/viewRenderer.js');
        let viewRenderer = require(viewPath)
        let htmlRendered = viewRenderer.render('post', {loggedin: loggedin, posts: dataArray})
        callback(htmlRendered)     
    })
}

module.exports.searchPosts = (loggedin, data, callback) => {
    let modelPath = path.join(__dirname, '../model/posts.js');
    let model = require(modelPath);

    let from = data.fromDestination;
    let to = data.toDestination;

    model.searchPosts(from, to, (dataArray) => {
        let viewPath = path.join(__dirname, '../views/viewRenderer.js');
        let viewRenderer = require(viewPath)
        let htmlRendered = viewRenderer.render('post', {loggedin: loggedin, posts: dataArray})
        callback(htmlRendered)   
    })
}