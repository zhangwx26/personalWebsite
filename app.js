// add some annotations
var express = require('express'),
    jade = require('jade'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser');

var count = 1685;

var index = function(req, res) {
    count++;
    console.log(count + ' people have visited your website!');
    res.render('index');
};

var partials = function (req, res) {
    var name = req.params.name;
    res.render(name);
};

var app = express();

app.set('views', __dirname + '/jades');
app.set('view engine', 'jade');
app.use(bodyParser());
app.engine('jade', jade.__express);

app.get('/', index);
app.get('/jades/:name', partials);

app.get('*', function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var filePath = __dirname + pathname;
    console.log(filePath);
    // var mimeType = getMimeType(pathname);
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                res.writeHead(500);
                res.end();
            } else {
                res.setHeader("Content-Length", data.length);
                // res.setHeader("Content-Type", mimeType);
                res.statusCode = 200;
                res.end(data);
            }
        });
    }
});

// Start server

app.listen(8000, function(){
  console.log("Express server listening on port 3000");
});






// http.createServer(function (req, res) {
    // var pathname = url.parse(req.url).pathname;
    // var filePath = __dirname + pathname;
    // var mimeType = getMimeType(pathname);
//     if (pathname == '/') {
//         count ++;
//         console.log(count + '人访问过你的网站');
//         filePath += '/index.html';
//         fs.readFile(filePath, function(err, data) {
//             if (err) {
//                 res.writeHead(500);
//                 res.end();
//             } else {
//                 res.setHeader("Content-Length", data.length);
//                 res.setHeader("Content-Type", 'text/html');
//                 res.statusCode = 200;
//                 res.end(data);
//             }
//         });
    // } else if (fs.existsSync(filePath)) {
    //     fs.readFile(filePath, function(err, data) {
    //         if (err) {
    //             res.writeHead(500);
    //             res.end();
    //         } else {
    //             res.setHeader("Content-Length", data.length);
    //             res.setHeader("Content-Type", mimeType);
    //             res.statusCode = 200;
    //             res.end(data);
    //         }
    //     });
//     } else {
//         res.writeHead(500);
//         res.end();
//     }
// }).listen(8000, function() {
//   console.log('server listen on 8000');
// });

function getMimeType(pathname) {
  var validExtensions = {
    ".html" : "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png"
  };
  var ext = path.extname(pathname);
  var type = validExtensions[ext];
  return type;
}