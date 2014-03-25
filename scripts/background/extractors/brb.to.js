
function BrbToExtract(text) {
  return text.replace(' на BrB.to (ex FS.ua & FS.to)', '')
}

titleExtractor.register('brb.to', BrbToExtract)
