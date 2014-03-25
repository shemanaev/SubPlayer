
$(function () {
  $subQuery.bind('keyup', function (e) {
    if (event.which === 13) {
      $subGo.click()
      return false
    }
    return true
  })

  function findSubtitlesClick(e) {
    if (!osToken) {
      return setTimeout(findSubtitlesClick.bind(this), 200)
    }

    function osSearchDone(response, status, jqXHR) {
      var subs = response[0].data
      var langs = {}
      if (subs) {
        for (var i = 0; i < subs.length; i++) {
          var sub = subs[i]
          if (sub.SubLanguageID in langs) continue
          langs[sub.SubLanguageID] = true
          $subSelector.append(JST['subtitles-item']({ uri: sub.SubDownloadLink, title: sub.SubFileName, lang: sub.SubLanguageID }))
        }
      } else {
        $subSelector.append(JST['subtitles-error']('Nothing found'))
      }
    }

    function osSearchFail(jqXHR, status, error) {
      $subSelector.append(JST['subtitles-error']('Error while searching subtitles: ' + error))
    }

    function osSearchAlways() {
      $subSpinner.hide()
    }

    $subSpinner.show()
    var text = $subQuery.val()
    var langs = settings.subtitlesLangs.join(',')
    var params =
      { url: OS_BASE
      , methodName: 'SearchSubtitles'
      , params: [osToken, [{sublanguageid: langs, query: text}]]
      }
    $subSelector.html('')
    $.xmlrpc(params).done(osSearchDone).fail(osSearchFail).always(osSearchAlways)
  }

  $subGo.bind('click', findSubtitlesClick)

  function setupPlayer(sub) {
    $player.html(JST['player']({ src: urlParams['src'], type: urlParams['type'], sub: sub }))
    $player.flowplayer()
    api = $player.data('flowplayer')
  }

  // run player on modal hide
  $subModal.on('hide.bs.modal', function (e) {
    var HTTP_PROTO = 'http'
    var sub = $('input[name=subtitles]:checked').val()
    if (sub && HTTP_PROTO === sub.substr(0, HTTP_PROTO.length)) {
      // fetch subtitles
      function getSubsDone(response) {
        var gunzip = new Zlib.Gunzip(response)
        var plain = gunzip.decompress()
        _arrayBufferToString(plain, function (text) {
          setupPlayer(text)
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

  $subModal.on('shown.bs.modal', function (e) {
    $subQuery.focus()
  })
})
