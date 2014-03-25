
var JST = {} // JS templates
var settingsLoaded = false
var settings =
  { translationLang: 'en-ru'
  , subtitlesLangs:
    [ 'eng'
    , 'rus'
    ]
  }
var $document
var $body

$(function () {
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
  $body = $('body')
})
