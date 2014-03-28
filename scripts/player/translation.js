/*global
  JST,
  api,
  settings,
  buildUrl,
  YANDEX_TRANSLATOR_KEY,
  YANDEX_TRANSLATOR_BASE,
  $document,
  $translation,
  $translationContent,
  $translationSpinner,
*/
$(function () {
  'use strict';
  // pause on mouse over subtitles
  var subSel = '.flowplayer .fp-subtitle.fp-active'
  var wordSel = '.flowplayer .fp-subtitle.fp-active p span'
  var timer = null
  var paused = 0
  var PNONE = 0
  var PPAUSED = 1
  var PUNPAUSED = 2
  var transCache = {} // tranlations cache

  function hideTranslation() {
    if (paused === PUNPAUSED) {
      api.play()
    }
    paused = PNONE
    $translation.hide()
  }

  function scheduleHide(onlyClear) {
    clearTimeout(timer)
    if (onlyClear) return
    timer = setTimeout(hideTranslation, 100)
  }

  // split replica by words
  $document.on('mouseenter', '.flowplayer .fp-subtitle.fp-active p', function (e) {
    var t = $(this)
    if (!t.data('splitted')) {
      var html = t.html().replace(/([^<\/>\s."][a-zа-яё0-9'-]+)/ig, '<span>$1</span>')
      t.html(html)
      t.data('splitted', true)
    }
  })

  // play/pause on hover subtitles are
  $document.on('mouseenter', subSel, function (e) {
    if (paused === PNONE) {
      paused = api.paused ? PPAUSED : PUNPAUSED
    }
    scheduleHide(true)
    api.pause()
  })
  $document.on('mouseleave', subSel, function (e) {
    scheduleHide(false)
  })

  // highlight hover word and show translation
  function translationAdjustPosition(elem) {
    $translation.css('top', elem.offset().top - $translation.height() - 20)
    $translation.css('left', elem.offset().left)
  }
  function translationShow(elem, text, translations) {
    $translationContent.html(JST.translation({ original: text, translations: translations.def }))
    $translationSpinner.hide()
    translationAdjustPosition(elem)
  }
  function translationShowLoading(elem) {
    $translationContent.html('')
    $translation.show()
    $translationSpinner.show()
    translationAdjustPosition(elem)
  }
  $document.on('mouseenter', wordSel, function (e) {
    var t = $(this)
    t.addClass('word-over')
    translationShowLoading(t)
    var text = t.html()
    if (text in transCache) {
      translationShow(t, text, transCache[text])
      return
    }
    var args =
      { key: YANDEX_TRANSLATOR_KEY
      , lang: settings.translationLang
      , text: text
      }
    var url = buildUrl(YANDEX_TRANSLATOR_BASE + 'lookup', args)
    $.get(url, function (res) {
      transCache[text] = res
      translationShow(t, text, res)
    })
  })
  $document.on('mouseleave', wordSel, function (e) {
    var t = $(this)
    t.removeClass('word-over')
  })
  // translation block
  $translation.on('mouseenter', function (e) {
    scheduleHide(true)
  })
  $translation.on('mouseleave', function (e) {
    scheduleHide(false)
  })
})
