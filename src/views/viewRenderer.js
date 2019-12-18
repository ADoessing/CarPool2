const ejs = require('ejs');
const fs = require('fs');
const pathCreator = require('path');

module.exports.render = (viewName, viewbag) => {
    let path = pathCreator.join(__dirname, './' + viewName + '.ejs');
    let htmlContent = fs.readFileSync(path, 'utf8');
    let htmlRenderized = ejs.render(htmlContent, { filename: viewName + '.ejs', viewbag: viewbag })
    return htmlRenderized;
}