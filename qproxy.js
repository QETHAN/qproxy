#!/usr/bin/env node

var static = require('node-static'),
	url = require('url'),
	qs = require('querystring'),
	agent = require('superagent');

var SS = new static.Server(process.cwd());

require('http').createServer(function (request, response) {
	var qs = url.parse(request.url, true);
	
    request.addListener('end', function () {
    	if(qs.query.jsonUrl) {
			agent.get(qs.query.jsonUrl, function(res) {
	        	response.writeHead(200, {
				  'Content-Type': 'application/json', 
				  'Access-Control-Allow-Origin': '*'
				});

	        	response.write(JSON.stringify(JSON.parse(res.text), null, 4));
	        	response.end();
	        });
		} else {
			SS.serve(request, response, function(err, result) {
				if (err) { 
	                console.error("Error serving " + request.url + " - " + err.message);
	                response.writeHead(err.status, err.headers);
	                response.write("OH no, 404");
	                response.end();
	        	}
			});
		}

    }).resume();
}).listen(4000);

console.log('Server running at http://127.0.0.1:4000/');