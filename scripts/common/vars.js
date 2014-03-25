
var JST = {} // JS templates
var $document = $(document)
var $body = $('body')

$(function () {
  // compile all templates
  $('script[type="text/template"]').each(function (e) {
    var t = $(this)
    JST[t.data('name')] = doT.template(t.html())
  })
})
