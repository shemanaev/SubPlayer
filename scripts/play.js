
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
  var transCache = {} // tranlations cache
  var osToken = null // opensubtitles.org API token

  // Log in to opensubtitles.org
  function osLoginDone(response, status, jqXHR) {
    osToken = response[0].token
    console.log('xmlrpc login done', response, osToken)
  }

  function osLoginFail(jqXHR, status, error) {
    console.log('xmlrpc login', error)
  }

  var params =
    { url: OS_BASE
    , methodName: 'LogIn'
    , params: [null, null, null, OS_USER_AGENT]
    }
  $.xmlrpc(params).done(osLoginDone).fail(osLoginFail)

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

  function fileRead(file) {
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
  }

  function fileDrop(e) {
    var file = e.originalEvent.dataTransfer.files[0]
    fileRead(file)
    $dropZone.hide()
    return false
  }

  $body.bind('dragenter', dragOver)
  $body.bind('dragover', dragOver)
  $body.bind('drop', fileDrop)

  // Subtitles select file
  $document.on('change', '.btn-file :file', function() {
    var t = $(this)
    var file = t.get(0).files[0]
    fileRead(file)
  })

  $subGo.bind('click', function (e) {
    function osSearchDone(response, status, jqXHR) {
      console.log('xmlrpc search done', response)
      var subs = response[0].data
      var langs = {}
      for (var i = 0; i < subs.length; i++) {
        var sub = subs[i]
        if (sub.SubLanguageID in langs) continue
        langs[sub.SubLanguageID] = true
        $subSelector.append(JST['subtitles-item']({ uri: sub.SubDownloadLink, title: sub.SubFileName, lang: sub.SubLanguageID }))
      }
    }

    function osSearchFail(jqXHR, status, error) {
      console.log('xmlrpc search', error)
      // TODO: display error
    }

    var text = $subQuery.val()
    var params =
      { url: OS_BASE
      , methodName: 'SearchSubtitles'
      , params: [osToken, [{sublanguageid: 'eng,rus', query: text/* + ' YIFY'*/}]/*, {limit: 15}*/]
      }
    // TODO: add progressbar or something here
    $subSelector.html('')
    $.xmlrpc(params).done(osSearchDone).fail(osSearchFail)
  })

  function setupPlayer(sub) {
    $player.html(JST['player']({ src: params['src'], type: params['type'], sub: sub }))
    $player.flowplayer()
    api = $player.data('flowplayer')
  }

  // run player on modal hide
  $subModal.on('hide.bs.modal', function (e) {
    var HTTP_PROTO = 'http'
    var sub = $('input[name=subtitles]:checked').val()
    if (HTTP_PROTO === sub.substr(0, HTTP_PROTO.length)) {
      // fetch subtitles
      function getSubsDone(response) {
        var gunzip = new Zlib.Gunzip(response)
        var plain = gunzip.decompress()
        _arrayBufferToString(plain, function (text) {
          setupPlayer('data:' + text)
        })
      }

      function getSubsFail(error) {
        // TODO: display error
        console.log('getSubsFail', error)
      }

      getBinary(sub, getSubsDone, getSubsFail)
    } else {
      setupPlayer(sub)
    }
  })

  // open subtitles search dialog
  document.title = params['title'] + ' | ' + EXTENSION_NAME
  $subQuery.val(params['title'])
  $subGo.click()
  $subModal.modal()
})
