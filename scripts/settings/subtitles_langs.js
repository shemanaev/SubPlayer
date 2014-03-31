/*global
  chrome,
  JST,
  settings,
  settingsLoaded,
  OS_BASE,
  $document,
  $subtitlesLangs,
  $subtitlesBestMatch,
*/
$(function initSubtitlesLangs() {
  'use strict';
  if (!settingsLoaded) {
    return setTimeout(initSubtitlesLangs.bind(this), 200)
  }

  $subtitlesBestMatch.bind('change', function (e) {
    settings.subtitlesBestMatch = this.checked
    chrome.storage.sync.set(settings)
  })
  $subtitlesBestMatch.prop('checked', settings.subtitlesBestMatch)

  $document.bind('change', '#subtitles-languages input[type=checkbox]', function (e) {
    settings.subtitlesLangs = []
    $('#subtitles-languages input[type=checkbox]:checked').each(function (i, el) {
      var $el = $(el)
      settings.subtitlesLangs.push($el.val())
    })
    chrome.storage.sync.set(settings)
  })

  function osLangsDone(response, status, jqXHR) {
    var langs = response[0].data
    for (var i = 0; i < langs.length; i++) {
      var lang = langs[i]
      var params =
        { code: lang.SubLanguageID
        , title: lang.LanguageName
        , checked: settings.subtitlesLangs.indexOf(lang.SubLanguageID) !== -1
        }
      $subtitlesLangs.append(JST['subtitles-language'](params))
    }
  }

  function osLangsFail(jqXHR, status, error) {
    $.pnotify({ text: 'Error retrieving available languages: ' + error })
  }

  var params =
    { url: OS_BASE
    , methodName: 'GetSubLanguages'
    , params: []
    }
  $.xmlrpc(params).done(osLangsDone).fail(osLangsFail)
})
