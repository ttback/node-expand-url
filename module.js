var request = require("request");
var http = require('http');

function expand(shortUrl, callback) {
	var pool = new http.Agent({'maxSockets': Infinity});
    request( { 
    	method: "HEAD"
      , url: shortUrl
      , followAllRedirects: true
      , timeout: 10000
      , pool: pool
	},
    function (error, response) {
        if (error) {
            callback(error);
        } else {
            callback(undefined, response.request.href);
        }
    }).end();
}

module.exports = {
    expand: expand
}