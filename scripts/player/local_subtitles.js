
$(function () {
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
