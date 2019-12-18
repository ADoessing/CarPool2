const http = require("http");
const url = require("url");
const queryString = require('querystring');
const ejs = require('ejs');
const fs = require('fs');

let sessions = []

let dispatch = Object.create(null);
dispatch.GET = (request, response) => {
    let controller;
    let fullPath = url.parse(request.url).pathname.split("/");
    let cookie = request.headers.cookie;
    let loggedin = loggedIn(cookie)

    switch (fullPath[1]) {
        case "":
        case "index":
            controller = require("./src/controller/index.js");
            controller.index(loggedin, (htmlResult) => {
                response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                response.end(htmlResult);
            })
            break;
        case "post":
            controller = require("./src/controller/post.js");
            controller.showPosts(loggedin, fullPath[2], (htmlResult) => {
                response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                response.end(htmlResult);
            })
            break;
        case "login":
            if (!loggedin) {
                controller = require("./src/controller/login.js");
                controller.index(loggedin, (htmlResult) => {
                    response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end(htmlResult);
                })
            } else {
                response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                response.end("Access Denied");
            }
            break;
        case "createUser":
            if (!loggedin) {
                controller = require("./src/controller/createUser.js");
                controller.index(loggedin, (htmlResult) => {
                    response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end(htmlResult);
                })
            }
            else {
                response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                response.end("Access Denied");
            }
            break;
        case "createPool":
            if (loggedin){
                controller = require("./src/controller/createPool.js");
                controller.index(loggedin, (htmlResult) => {
                    response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end(htmlResult);
                })
            } else {
                response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                response.end("Access Denied");
            }
            break;
        case "logout":
            if (loggedin) {
                if (endSession(cookie)){
                    response.writeHead(303, {'Location': '/login' ,"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end();
                } else {
                    response.writeHead(500, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end();
                }
            } else {
                response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                response.end("Access Denied");
            }
            break;
        default:
            response.writeHead(404, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": '*'});
            response.end('Not found\n');
    }
}

dispatch.POST = (request, response) => {
    let controller;
    let fullPath = url.parse(request.url).pathname.split("/");
    let message = '';
    let cookie = request.headers.cookie;
    let loggedin = loggedIn(cookie);
    let session;
    let path = require('path');

    request.on('data', data =>{
        message += data.toString();
    })

    request.on('end', () =>{
        let parsedMessage;
        parsedMessage = queryString.parse(message)

        switch (fullPath[1]) {
            case "login":
                let count = 0;
                let email = "";
                let timeout = 12000;
                let lastExecuted = 0;
                let date = new Date();
                let enabled = true;
                let seconds = 0;
                session = require(path.join(__dirname,'/services/sessiongenerator.js'));


                  if (enabled == true ) {

                    if (!loggedin) {
                        controller = require("./src/controller/login.js");
                        controller.login(loggedin, parsedMessage, (htmlResult, success, userid)=>{
                            if (success){
                                let sessionID = session.random();
                                response.writeHead(303, {'Location': '/post' ,"Content-Type": "text/html",'Set-Cookie': 'myCookie={"userID": "'+userid+'", "sessionID": "'+sessionID+'"}', "Access-Control-Allow-Origin": '*'});
                                sessions.push({userID: userid, sessionID: sessionID})
                                response.end();
                            } else {
                                count++;
                                email = parsedMessage.email;
                                if (count >= 3 && email == parsedMessage.email) {
                                  enabled = false;
                                  seconds = date.getTime();
                                  response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                                  response.end(htmlResult);
                                }
                                response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                                response.end(htmlResult);
                            }
                        });
                    } else {
                        response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                        response.end("Access Denied");
                    }
                    break;
                  } else {
                    if ((seconds - lastExecuted) > timeout) {
                      lastExecuted = seconds;
                      enabled = true;
                      response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                      response.end(htmlResult);
                    }
                    response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end(htmlResult);
                  }





            case "createUser":
                if (!loggedin) {
                    controller = require("./src/controller/createUser.js");
                    controller.createUser(loggedin, parsedMessage, (success, htmlResult)=>{
                        if (success){
                            response.writeHead(303, {'Location': '/login' ,"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                            response.end();
                        } else {
                            response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                            response.end(htmlResult);
                        }
                    });
                } else {
                    response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end("Access Denied");
                }
                break;
            case "createPool":
                if (loggedin){
                    controller = require("./src/controller/createPool.js");
                    controller.createPool(loggedin, getUserID(cookie), parsedMessage, (success, htmlResult)=>{
                        if (success){
                            response.writeHead(303, {'Location': '/post' ,"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                            response.end();
                        } else {
                            response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                            response.end(htmlResult);
                        }
                    });
                } else {
                    response.writeHead(401, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end("Access Denied");
                }
                break;
            case "post":
                controller = require("./src/controller/post.js");
                controller.searchPosts(loggedin, parsedMessage, (htmlResult)=>{
                    response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": '*'});
                    response.end(htmlResult);
                });
                break;
            default:
                response.writeHead(404, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": '*'});
                response.end('Not found\n');
        }
    })
}

function loggedIn(cookie) {
    try {
        if (cookie != undefined){
            let cookieBody = cookie.split("=");

            let jsonCookie = JSON.parse(cookieBody[1]);
            let userid = jsonCookie.userID;
            let sessionid = jsonCookie.sessionID;

            for (var fieldIndex in sessions){
                let sessionsUserID = sessions[fieldIndex].userID
                let sessionsSessionID = sessions[fieldIndex].sessionID
                if (sessionsUserID === userid && sessionsSessionID === sessionid)
                    return true;
            }
            return false;
        }
    } catch (err){
        console.log(err)
        return false;
    }
}

function getUserID(cookie){
    let cookieBody = cookie.split("=");

    let jsonCookie = JSON.parse(cookieBody[1]);
    return userid = jsonCookie.userID;
}

function endSession(cookie){
    try {
        if (cookie != undefined){
            let cookieBody = cookie.split("=");

            let jsonCookie = JSON.parse(cookieBody[1]);
            let userid = jsonCookie.userID;
            let sessionid = jsonCookie.sessionID;

            for (var fieldIndex in sessions){
                let sessionsUserID = sessions[fieldIndex].userID
                let sessionsSessionID = sessions[fieldIndex].sessionID
                if (sessionsUserID === userid && sessionsSessionID === sessionid)
                    sessions.splice(fieldIndex, fieldIndex+1)
                return true;
            }
            return false;
        }
    } catch (err){
        console.log(err)
        return false;
    }
}

http.createServer((request, response) => {
    console.log(request.method, request.url);
    try { dispatch[request.method](request, response); }
    catch (err) {
        response.writeHead(405, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": '*'});
        response.end('Method not allowed\n');
        console.log(err)
    }
}).listen(8080);
