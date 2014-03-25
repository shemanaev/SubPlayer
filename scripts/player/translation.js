
$(function () {
  // pause on mouse over subtitles
  var subSel = '.flowplayer .fp-subtitle.fp-active'
  var wordSel = '.flowplayer .fp-subtitle.fp-active p span'
  var pauseTimer = null
  var translationTimer = null

  function scheduleHide(onlyClear) {
    clearTimeout(pauseTimer)
    clearTimeout(translationTimer)
    if (onlyClear) return
    pauseTimer = setTimeout(api.play.bind(api), 100)
    translationTimer = setTimeout($translation.hide.bind($translation), 100)
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
    scheduleHide(true)
    api.pause()
  })
  $document.on('mouseleave', subSel, function (e) {
    scheduleHide(false)
  })

  // highlight hover word and show translation
  function translationAdjustPosition() {
    $translation.css('top', $(subSel).offset().top - $translation.height() - 10)
    $translation.css('left', ($document.width() - $translation.width()) / 2)
  }
  function translationShow(text, translations) {
    $translationContent.html(JST['translation']({ original: text, translations: translations.def }))
    $translationSpinner.hide()
    translationAdjustPosition()
  }
  function translationShowLoading() {
    $translationContent.html('')
    $translation.show()
    $translationSpinner.show()
    translationAdjustPosition()
  }
  $document.on('mouseenter', wordSel, function (e) {
    var t = $(this)
    t.addClass('word-over')
    translationShowLoading()
    var text = t.html()
    if (text in transCache) {
      translationShow(text, transCache[text])
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
      translationShow(text, res)
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
