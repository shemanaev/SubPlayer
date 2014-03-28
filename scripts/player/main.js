/*global
  EXTENSION_NAME,
  api,
  settingsLoaded,
  urlParams,
  $document,
  $window,
  $player,
  $subQuery,
  $subModal,
  $subGo,
*/
$(function initMain() {
  'use strict';
  if (!settingsLoaded) {
    return setTimeout(initMain.bind(this), 200)
  }

  // fix annoying pause toggle only on mouse over
  $document.keyup(function (event) {
    if (event.which === 32 && $player.hasClass('is-mouseout')) {
      api.toggle()
      return false
    }
    return true
  })

  $window.resize(function (e) {
    var w = $window.width()
    var h = $window.height()

    if (w >= h) {
      $player.height(h + 'px')
    } else {
      $player.width(w + 'px')
    }
    $player.css('margin-left', ($window.width() - $player.width()) / 2 + 'px')
  })

  // open subtitles search dialog
  $subQuery.val(urlParams.title)
  $subGo.click()
  $subModal.modal()
})
