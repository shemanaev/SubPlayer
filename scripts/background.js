

var videos = {} // All captured videos


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

/**
 * Open player page on browserAcrion button click
 */
function openPlayer(tab) {
  var video = videos[tab.id]
  console.log('open', video, tab.id, tab)
  if (!video) return

  var args =
    { src: video.src
    , type: video.type
    , title: tab.title
    }
  var url = buildUrl(chrome.extension.getURL('play.html'), args)

  // ToDo: Search for subtitles or title here?
  chrome.tabs.create({url: url}, function (tab) {
    // created
  })
}

/**
 * Fires on tab closed
 */
function tabClosed(tabId) {
  delete videos[tabId]
}

/**
 * Check that it's video Content-Type
 */
function isVideo(type) {
  var VIDEO_TYPE = 'video/'

  if (type.substr(0, VIDEO_TYPE.length) === VIDEO_TYPE) {
    return true
  }
  // if (t === "application/octet-stream") {
  //     if (e.indexOf(".flv") !== -1)
  //         return !0;
  //     if (e.indexOf(".youtube.com/") !== -1)
  //         return !0
  // }
  return false
}

/**
 * Callback on Chrome received headers
 */
function headersReceived(e) {
  var h = e.responseHeaders
  for (var i = 0; i < h.length; i++) {
    var t = h[i]
    if (t.name === 'Content-Type') {
      if (isVideo(t.value)) {
        videos[e.tabId] = { src: e.url, type: t.value }
        console.log(videos[e.tabId])
      }
      break
    }
  }
}

// Setup Chrome callbacks
chrome.tabs.onRemoved.addListener(tabClosed)
chrome.browserAction.onClicked.addListener(openPlayer)
chrome.webRequest.onHeadersReceived.addListener(headersReceived, {urls: ['<all_urls>']}, ['responseHeaders'])
