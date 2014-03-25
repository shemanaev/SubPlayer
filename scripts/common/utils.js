
/**
 * Build URL query from arguments object
 */
function buildUrl(base, args) {
  var s = base + '?'
  for (var arg in args) {
    s += encodeURIComponent(arg) + '=' + encodeURIComponent(args[arg]) + '&'
  }
  return s.slice(0, s.length - 1)
}

/**
 * Stupid URL parser
 */
function parseUrl(url) {
  var a = document.createElement('a')
  a.href = url
  return a
}


function getBinary(url, callback, error) {
  function onLoadHandler(event) {
    if (this.status == 200) {
      var array = new Uint8Array(this.response)
      callback(array)
    } else {
      error(this.status)
    }
  }

  function onErrorHandler(event) {
    error(event)
  }

  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.addEventListener('load', onLoadHandler, false)
  xhr.addEventListener('error', onErrorHandler, false)

  xhr.send()
}

/**
 * Converts an array buffer to a string
 *
 * @private
 * @param {ArrayBuffer} buf The buffer to convert
 * @param {Function} callback The function to call when conversion is complete
 */
function _arrayBufferToString(buf, callback) {
  var bb = new Blob([new Uint8Array(buf)])
  var f = new FileReader()
  f.onload = function(e) {
    callback(e.target.result)
  }
  f.readAsText(bb)
}
