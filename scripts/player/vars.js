/*global
  EXTENSION_NAME,
  OS_BASE,
  OS_USER_AGENT,
*/
var urlParams = {} // url parameters
var $player
var $translation
var $translationContent
var $translationSpinner
var $dropZone
var $subModal
var $subGo
var $subQuery
var $subSelector
var $subSpinner
var $subSettingsModal
var $subSelectBtn
var api // flowplayer API
var osToken = null // opensubtitles.org API token
var localSubtitles

$(function () {
  'use strict';
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

  $player = $('.player')
  $translation = $('#translation')
  $translationContent = $('#translation-content')
  $translationSpinner = $('#translation-spinner')
  $dropZone = $('#drop-zone')
  $subModal = $('#subtitles-search-modal')
  $subGo = $('#subtitles-go')
  $subQuery = $('#subtitles-query')
  $subSelector = $('#subtitles-selector')
  $subSpinner = $('#subtitles-spinner')
  $subSettingsModal = $('#subtitles-settings-modal')
  $subSelectBtn = $('#sutitles-select-button')

  // assign page title
  document.title = urlParams.title + ' | ' + EXTENSION_NAME
})
