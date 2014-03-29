/*global
  EXTENSION_NAME,
*/
var $subtitlesLangs
var $subtitlesBestMatch
var $translationLang
var $newTab

$(function () {
  'use strict';
  $subtitlesLangs = $('#subtitles-languages')
  $subtitlesBestMatch = $('#subtitles-best-match')
  $translationLang = $('#translation-language')
  $newTab = $('#open-new-tab')

  document.title = EXTENSION_NAME + ' settings'
  $('#title').html(EXTENSION_NAME)
})
