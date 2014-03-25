
/**
 * Useful core for extracting movie title from page title
 */
function TitleExtractor() {
  this.extractors = {}
}

TitleExtractor.prototype.register = function (domain, callback) {
  this.extractors[domain] = callback
}

TitleExtractor.prototype.extract = function (domain, text) {
  var res = text
  if (domain in this.extractors) res = this.extractors[domain](text)
  return res
}

// Bring the default instance
var titleExtractor = new TitleExtractor()
