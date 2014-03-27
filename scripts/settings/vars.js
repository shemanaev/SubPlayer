
var $subtitlesLangs
var $subtitlesBestMatch
var $translationLang

$(function () {
  $subtitlesLangs = $('#subtitles-languages')
  $subtitlesBestMatch = $('#subtitles-best-match')
  $translationLang = $('#translation-language')

  document.title = EXTENSION_NAME + ' settings'
  $('#title').html(EXTENSION_NAME)
})
