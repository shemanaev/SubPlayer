
var $subtitlesLangs
var $translationLang

$(function () {
  $subtitlesLangs = $('#subtitles-languages')
  $translationLang = $('#translation-language')

  document.title = EXTENSION_NAME + ' settings'
  $('#title').html(EXTENSION_NAME)
})
