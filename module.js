const request = require("request")
    , http    = require('http')

function expand(shortUrl, options, callback) {
    let returnPromise = false
    // options are optional, the function can still be used like this: expand(shortUrl, callback)
    if(typeof options == 'function') {
        callback = options
        options  = {}
    } else if(!callback) {
        returnPromise = true
    }

    const defaultOptions = { 
    	  method             : "HEAD"
      , url                : shortUrl
      , followAllRedirects : true
      , timeout            : 10000
      , pool               : new http.Agent({'maxSockets': Infinity})
	  }

    if(!options || typeof options != 'object') options = {}

    // merge the user-supplied options with the default options
    for (let attribute in options)
        defaultOptions[attribute] = options[attribute]

    if (defaultOptions.headers && !defaultOptions.headers['User-Agent']) {
        defaultOptions.headers['User-Agent'] = 'node-url-expander'
    } else {
        defaultOptions.headers = {'User-Agent' : 'node-url-expander'}
    }

    return new Promise((resolve, reject) => {
        request(defaultOptions, (error, response) => {
          if (error) {
              return returnPromise ? reject(err) : callback(error)
          } else {
              return returnPromise ? resolve(response.request.href) : callback(undefined, response.request.href)
          }
        }).setMaxListeners(0)
    })
}

module.exports = {
    expand : expand
}
