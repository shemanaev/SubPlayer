/*global
  chrome,
  api,
  settings,
  $document,
  $player,
  $subModal,
  $subSettingsModal,
  SUB_POSITION_MAX,
  SUB_POSITION_OFFSET,
*/
$(function () {
  'use strict';

  $document.on('click', '#player-settings-button', function (event) {
    $subSettingsModal.modal()
    return false
  })

  $document.on('click', '#player-subtitles-button', function (event) {
    $subModal.modal()
    return false
  })
})

$(function playerSettingsInit() {
  'use strict';

  if (!document.querySelector('#player-settings-button')) {
    return setTimeout(playerSettingsInit.bind(this), 200)
  }

  // Adjust subtitles settings
  var $playerSettingsSize = $('#player-settings-size')
  var $playerSettingsPosition = $('#player-settings-position')
  var $playerSettingsShift = $('#player-settings-shift')
  var $subHolder = $('.fp-subtitle')
  var defaultBottom = parseInt($subHolder.css('bottom'))
  var shift = 0

  $subHolder.css('font-size', settings.subtitlesSize + '%')
  $subHolder.css('bottom', defaultBottom + settings.subtitlesPosition * SUB_POSITION_OFFSET + 'px')

  $playerSettingsSize.val(settings.subtitlesSize + '%')
  $playerSettingsPosition.val(settings.subtitlesPosition)
  $playerSettingsShift.val(shift)

  // Resize on fullscreen
  api.bind('fullscreen', function(e) {
    $subHolder.css('font-size', screen.width / $player.width() * settings.subtitlesSize + '%')
  }).bind('fullscreen-exit', function(e) {
    $subHolder.css('font-size', settings.subtitlesSize + '%')
  })

  // Font size
  function adjustFontSize(plus) {
    if (plus) {
      if (settings.subtitlesSize < 200) settings.subtitlesSize += 10
    } else {
      if (settings.subtitlesSize > 10) settings.subtitlesSize -= 10
    }
    var size = settings.subtitlesSize + '%'
    $playerSettingsSize.val(size)
    $subHolder.css('font-size', size)
    chrome.storage.sync.set(settings)

    return false
  }

  $('#player-settings-size-minus').click(function (event) {
    return adjustFontSize(false)
  })

  $('#player-settings-size-plus').click(function (event) {
    return adjustFontSize(true)
  })

  // Position
  function adjustPosition(up) {
    if (up) {
      if (settings.subtitlesPosition < SUB_POSITION_MAX) settings.subtitlesPosition += 1
    } else {
      if (settings.subtitlesPosition > -SUB_POSITION_MAX) settings.subtitlesPosition -= 1
    }
    $playerSettingsPosition.val(settings.subtitlesPosition)
    $subHolder.css('bottom', defaultBottom + settings.subtitlesPosition * SUB_POSITION_OFFSET + 'px')
    chrome.storage.sync.set(settings)

    return false
  }

  $('#player-settings-position-down').click(function (event) {
    return adjustPosition(false)
  })

  $('#player-settings-position-up').click(function (event) {
    return adjustPosition(true)
  })

  // Time shift
  function timeShift(plus) {
    var t = shift + (plus ? 1 : -1)
    var n = t - shift
    if (n === 0) return

    var add = function (e, t, n) {
      e[t] += n
    }

    for (var i = 0; i < api.cuepoints.length; i += 2) {
      add(api.cuepoints[i], 'time', n)
      add(api.cuepoints[i].subtitle, 'startTime', n)
      add(api.cuepoints[i].subtitle, 'endTime', n)
      add(api.cuepoints[i + 1], 'time', n)
    }

    shift += n
    $playerSettingsShift.val(shift)

    return false
  }
  $('#player-settings-shift-back').click(function (event) {
    return timeShift(false)
  })

  $('#player-settings-shift-forward').click(function (event) {
    return timeShift(true)
  })
})
