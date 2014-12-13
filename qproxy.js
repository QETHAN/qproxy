#!/usr/bin/env node

var static = require('node-static'),
	url = require('url'),
	qs = require('querystring'),
	fs = require('fs'),
	path = require('path'),
	agent = require('superagent');

var SS = new static.Server(process.cwd());

function statsFileOrDirectory(filepath, request, response) {
	fs.stat(filepath, function(err, stats) {
		if (err) {
			errorCallback(err, request, response);
		} else {
			if (stats.isFile()) {
				fileCB(request, response);
			} else if (stats.isDirectory()) {
				dirCB(filepath, request, response);
			}
		}
	});
}

function errorCallback(err, request, response) {
	console.error("Error serving " + request.url + " - " + err.message);
	response.writeHead(404, {
	  'Content-Type': 'text/plain' 
	});
    response.write("OH no, 404");
    response.end();
}

// process single file
function fileCB(request, response) {
	SS.serve(request, response, function(err, result) {
		if (err) { 
            errorCallback(err, request, response);
    	}
	});
}

//process directory
function dirCB(dir, request, response) {
	var html = '<ul>';
	fs.readdir(dir, function(err, files) {
		if (err) {
			errorCallback(err, request, response);
		}
		files.forEach(function(file) {
			var filepath = path.resolve(dir, file),
				linkpath = filepath.substring(filepath.indexOf(dir) + dir.length),
				stats = fs.statSync(filepath);
			
			if (stats.isFile()) {
				html += '<li style="margin-bottom: 10px;"><a href="' + linkpath + '">' + file + '</a></li>';
			} else if (stats.isDirectory) {
				html += '<li style="margin-bottom: 10px;"><a style="color: #D02BA9;" href="' + linkpath + '/">/' + file + '</a></li>';
			}
		});
		
		html += "</ul>";
		response.writeHead(200, {
			'Content-Type': 'text/html'
		})
		response.write(html);
		response.end();
	});
}


require('http').createServer(function (request, response) {

	var qs = url.parse(request.url, true);
	
    request.addListener('end', function () {
    	if (qs.query.jsonUrl) {
			agent.get(qs.query.jsonUrl, function(res) {
	        	response.writeHead(200, {
				  'Content-Type': 'application/json', 
				  'Access-Control-Allow-Origin': '*'
				});

	        	response.write(JSON.stringify(JSON.parse(res.text), null, 4));
	        	response.end();
	        });
		} else {
			var cwd = process.cwd(),
				realPath = cwd + request.url;

			statsFileOrDirectory(realPath, request, response);
		}

    }).resume();
}).listen(4000);

console.log('Server running at http://127.0.0.1:4000/');