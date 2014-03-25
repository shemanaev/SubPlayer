
var urlParams = {} // url parameters
var $player = $('.player')
var $translation = $('#translation')
var $translationContent = $('#translation-content')
var $translationSpinner = $('#translation-spinner')
var $dropZone = $('#drop-zone')
var $subModal = $('#subtitles-search-modal')
var $subGo = $('#subtitles-go')
var $subQuery = $('#subtitles-query')
var $subSelector = $('#subtitles-selector')
var $subSpinner = $('#subtitles-spinner')
var api // flowplayer API
var transCache = {} // tranlations cache
var osToken = null // opensubtitles.org API token

$(function () {
  // Log in to opensubtitles.org
  function osLoginDone(response, status, jqXHR) {
    osToken = response[0].token
  }

  function osLoginFail(jqXHR, status, error) {
    console.log('xmlrpc login', error)
  }

  var params =
    { url: OS_BASE
    , methodName: 'LogIn'
    , params: [null, null, null, OS_USER_AGENT]
    }
  $.xmlrpc(params).done(osLoginDone).fail(osLoginFail)

  // parse url parameters
  window
    .location
    .search
    .slice(1)
    .split('&')
    .map(function (e) {
      var t = e.split('=')
      urlParams[t[0]] = decodeURIComponent(t[1])
    })

  // assign page title
  document.title = urlParams['title'] + ' | ' + EXTENSION_NAME
})
