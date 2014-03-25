
var videos = {} // All captured videos

/**
 * Open player page on browserAcrion button click
 */
function openPlayer(tab) {
  var video = videos[tab.id]
  console.log('open', video, tab.id, tab)
  if (!video) return

  var host = parseUrl(tab.url).host
  var title = titleExtractor.extract(host, tab.title)
  var args =
    { src: video.src
    , type: video.type
    , title: title
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
  var CONTENT_TYPE = 'content-type'
  var h = e.responseHeaders
  var tabId = e.tabId
  for (var i = 0; i < h.length; i++) {
    var t = h[i]
    if (t.name.toLowerCase() === CONTENT_TYPE) {
      if (isVideo(t.value)) {
        videos[tabId] = { src: e.url, type: t.value }
        chrome.browserAction.setIcon({ path: 'icons/icon_19_green.png', tabId: tabId })
      }
      break
    }
  }
}

/**
 * Replace the User-Agent header for opensubtitles.org
 */
function openSubtitlesUA(e) {
  var USER_AGENT = 'user-agent'
  var h = e.requestHeaders
  for (var i = 0; i < h.length; i++) {
    var t = h[i]
    if (t.name.toLowerCase() == 'user-agent') {
      t.value = OS_USER_AGENT
      break
    }
  }
  return {requestHeaders: h}
}

// Setup Chrome callbacks
chrome.tabs.onRemoved.addListener(tabClosed)
chrome.browserAction.onClicked.addListener(openPlayer)
chrome.webRequest.onHeadersReceived.addListener(headersReceived, {urls: ['<all_urls>']}, ['responseHeaders'])
chrome.webRequest.onBeforeSendHeaders.addListener(openSubtitlesUA,
  {urls: ['​http://api.opensubtitles.org/xml-rpc'], types: ['main_frame', 'sub_frame']},
  ['blocking', 'requestHeaders']
)
