## what is this

* it is a static server maker and makes easy way to request API which can flatten the CORS problem.

## what this can do

* it is very easy to make a directory to become on a static web server, so you can visit files(html, js, css...) through `http://localhost:4000/xxx` 

* it is API middleware, very useful for ajax CORS request.
  it help request API and return data to ajax.
  
## how to use
1. install

   * npm install -g qproxy 

   * sudo npm install -g qproxy (if need root)
   
2. enter terminal, cd path/to/directory, execute command `qproxy`. then you can visit `http://localhost:4000/xxx`

3. js (use jquery)

```
$.ajax({
	url: 'http://localhost:4000/?jsonUrl=http://api.hupu.com/gamespace/stats/match_id/24576',
	method: 'GET',
	dataType: 'json'
}).done(function(data) {
	console.log(data);
});

```

* jsonUrl: (optional)
  
  ```
  the API url
  
  ``` 


