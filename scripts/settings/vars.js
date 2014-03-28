/*global
  EXTENSION_NAME,
*/
var $subtitlesLangs
var $subtitlesBestMatch
var $translationLang

$(function () {
  'use strict';
  $subtitlesLangs = $('#subtitles-languages')
  $subtitlesBestMatch = $('#subtitles-best-match')
  $translationLang = $('#translation-language')

  document.title = EXTENSION_NAME + ' settings'
  $('#title').html(EXTENSION_NAME)
})
