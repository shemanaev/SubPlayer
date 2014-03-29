/*global
  chrome,
  settings,
  settingsLoaded,
  $subtitlesLangs,
  $newTab,
*/
$(function initGeneral() {
  'use strict';
  if (!settingsLoaded) {
    return setTimeout(initGeneral.bind(this), 200)
  }

  $newTab.bind('change', function (e) {
    settings.newTab = this.checked
    chrome.storage.sync.set(settings)
  })
  $newTab.prop('checked', settings.newTab)
})
