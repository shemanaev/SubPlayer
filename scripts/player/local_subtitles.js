/*global
  EXTENSION_NAME,
  JST,
  localSubtitles: true,
  $body,
  $document,
  $dropZone,
  $subSelector,
  $subModal,
  $subSelectBtn,
*/
$(function () {
  'use strict';
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
      localSubtitles = new Uint8Array(event.target.result)
      $subSelector.append(JST['subtitles-item']({ uri: 'local', title: file.name }))
      var el = $('input:radio[name=subtitles]:last')
      el.prop('checked', true)
      el.parent().addClass('active')
      $subSelectBtn.click()
    }

    reader.onerror = function(event) {
      console.error('Error reading file:', event.target.error.code)
    }

    reader.readAsArrayBuffer(file)
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
  function fileSelected() {
    var t = $(this)
    var file = t.get(0).files[0]
    fileRead(file)
  }
  $document.on('change', '.btn-file :file', fileSelected)
})
