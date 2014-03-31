/*global
  chrome,
  buildUrl,
  JST,
  settings,
  settingsLoaded,
  $translationLang,
  YANDEX_TRANSLATOR_BASE,
  YANDEX_TRANSLATOR_KEY,
*/
$(function initTranslationLang() {
  'use strict';
  if (!settingsLoaded) {
    return setTimeout(initTranslationLang.bind(this), 200)
  }

  $translationLang.bind('change', function (e) {
    settings.translationLang = $translationLang.val()
    chrome.storage.sync.set(settings)
  })

  function translationGetDone(res) {
    for (var i = 0; i < res.length; i++) {
      var lang = res[i]
      var params =
        { title: lang
        , selected: lang === settings.translationLang
        }
      $translationLang.append(JST['translation-language'](params))
    }
  }

  function translationGetFail() {
    $.pnotify({ text: 'Error retrieving available translation languages' })
  }

  var url = buildUrl(YANDEX_TRANSLATOR_BASE + 'getLangs', { key: YANDEX_TRANSLATOR_KEY })
  $.get(url).done(translationGetDone).fail(translationGetFail)
})
