const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports.index = (loggedin, callback) => {
    let viewPath = path.join(__dirname, '../views/viewRenderer.js');
    let viewRenderer = require(viewPath)
    let htmlRenderized = viewRenderer.render("index", {loggedin: loggedin});
    callback(htmlRenderized);
}