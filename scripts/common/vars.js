/*global
  chrome,
  doT,
*/
var JST = {} // JS templates
var settingsLoaded = false
var settings =
  { translationLang: 'en-ru'
  , subtitlesLangs:
    [ 'eng'
    , 'rus'
    ]
  , subtitlesBestMatch: true
  , subtitlesSize: 100
  , subtitlesPosition: 0
  , subtitlesOpacity: 0
  }
var $document
var $window
var $body

$(function () {
  'use strict';
  // load settings
  chrome.storage.sync.get(settings, function(items) {
    settings = items
    settingsLoaded = true
  })

  // compile all templates
  $('script[type="text/template"]').each(function (e) {
    var t = $(this)
    JST[t.data('name')] = doT.template(t.html())
  })

  $document = $(document)
  $window = $(window)
  $body = $('body')
})
