
$(function () {
  // fix annoying pause toggle only on mouse over
  $document.keyup(function (event) {
    if (event.which === 32 && $player.hasClass('is-mouseout')) {
      api.toggle()
      return false
    }
    return true
  })

  // open subtitles search dialog
  $subQuery.val(urlParams['title'])
  $subGo.click()
  $subModal.modal()
})
