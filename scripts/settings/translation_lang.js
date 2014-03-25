
$(function initTranslationLang() {
  if (!settingsLoaded) {
    return setTimeout(initTranslationLang.bind(this), 200)
  }

  $translationLang.bind('change', function (e) {
    settings.translationLang = $translationLang.val()
    chrome.storage.sync.set(settings)
  })

  var url = buildUrl(YANDEX_TRANSLATOR_BASE + 'getLangs', { key: YANDEX_TRANSLATOR_KEY })
  $.get(url, function (res) {
    for (var i = 0; i < res.length; i++) {
      var lang = res[i]
      var params =
        { title: lang
        , selected: lang === settings.translationLang
        }
      $translationLang.append(JST['translation-language'](params))
    }
  })
})
