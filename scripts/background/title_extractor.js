
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
  if (!domain in this.extractors) return text
  var e = this.extractors[domain]
  return e(text)
}

// Bring the default instance
var titleExtractor = new TitleExtractor()
