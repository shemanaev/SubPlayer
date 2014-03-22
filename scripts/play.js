
var EXTENSION_NAME = 'SubtitlePlayer'
var YANDEX_TRANSLATOR_BASE = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'
var YANDEX_TRANSLATOR_KEY = 'KEY_HERE'

/**
 * Build URL query from arguments object
 */
function buildUrl(base, args) {
  var s = base + '?'
  for (var arg in args) {
    s += encodeURIComponent(arg) + '=' + encodeURIComponent(args[arg]) + '&'
  }
  return s.slice(0, s.length - 1)
}


$(function () {
  var JST = {} // JS templates
  var params = {} // url parameters
  var $document = $(document)
  var $body = $('body')
  var $player = $('.player')
  var $translation = $('#translation')
  var $dropZone = $('#drop-zone')
  var $subModal = $('#subtitles-search-modal')
  var $subGo = $('#subtitles-go')
  var $subQuery = $('#subtitles-query')
  var $subSelector = $('#subtitles-selector')
  var api // flowplayer API
  var transCache = {}

  // compile all templates
  $('script[type="text/template"]').each(function (e) {
    var t = $(this)
    JST[t.data('name')] = doT.template(t.html())
  })

  // parse url parameters
  window
    .location
    .search
    .slice(1)
    .split('&')
    .map(function (e) {
      var t = e.split('=')
      params[t[0]] = decodeURIComponent(t[1])
    })

  // fix annoying pause toggle only on mouse over
  $document.keyup(function (event) {
    if (event.which === 32 && $player.hasClass('is-mouseout')) {
      api.toggle()
      return false
    }
    return true
  })


  // pause on mouse over subtitles
  var subSel = '.flowplayer .fp-subtitle.fp-active'
  var wordSel = '.flowplayer .fp-subtitle.fp-active > p > span'
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
  $document.on('mouseenter', '.flowplayer .fp-subtitle.fp-active > p', function (e) {
    var t = $(this)
    if (!t.data('splitted')) {
      var html = t.html().replace(/([a-zа-яё0-9'-]+)/ig, '<span>$1</span>')
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
  // highlight hover word
  $document.on('mouseenter', wordSel, function (e) {
    var t = $(this)
    t.addClass('word-over')
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

  function showTranslation(text, translations) {
    $translation.html(JST['translation']({ original: text, translations: translations.def }))
    $translation.show()
    $translation.css('top', $(subSel).offset().top - $translation.height() - 10)
    $translation.css('left', ($document.width() - $translation.width()) / 2)
  }

  $document.on('click', wordSel, function (e) {
    var t = $(this)
    var text = t.html()
    if (text in transCache) {
      showTranslation(text, transCache[text])
      return
    }
    var args =
      { key: YANDEX_TRANSLATOR_KEY
      , lang: 'en-ru'
      , text: text
      }
    var url = buildUrl(YANDEX_TRANSLATOR_BASE, args)
    $.get(url, function (res) {
      transCache[text] = res
      showTranslation(text, res)
    })
  })

  // Subtitles drag&drop
  var dropTimeout = null
  function dragOver(e) {
    $dropZone.show()
    clearTimeout(dropTimeout)
    dropTimeout = setTimeout(function () {
      $dropZone.hide()
      dropTimeout = null
    }, 100)
    return false
  }

  function fileDrop(e) {
    var file = e.originalEvent.dataTransfer.files[0]
    var reader = new FileReader()
    reader.onload = function(event) {
      var dataUri = 'data:' + event.target.result
      $subSelector.append(JST['subtitles-item']({ uri: dataUri, title: file.name }))
      $('input:radio[name=subtitles]:last').prop('checked', true)
      $subModal.modal('hide')
    }

    reader.onerror = function(event) {
      console.error('Error reading file:', event.target.error.code)
    }

    reader.readAsText(file)
    // reader.readAsDataURL(file)
    // data:application/x-subrip;charset=utf-8,
    $dropZone.hide()
    return false
  }

  $body.bind('dragenter', dragOver)
  $body.bind('dragover', dragOver)
  $body.bind('drop', fileDrop)

  $subGo.bind('click', function (e) {
    //$.get()
    //$subSelector.append(JST['subtitles-item']({ uri: 'dataUri', title: 'title' }))
  })

  // run player on modal hide
  $subModal.on('hide.bs.modal', function (e) {
    var sub = $('input[name=subtitles]:checked').val()
    $player.html(JST['player']({ src: params['src'], type: params['type'], sub: sub }))
    $player.flowplayer()
    api = $player.data('flowplayer')
  })

  // open subtitles search dialog
  document.title = params['title'] + ' | ' + EXTENSION_NAME
  $subQuery.val(params['title'])
  $subGo.click()
  $subModal.modal()
})
