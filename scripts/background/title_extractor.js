
/**
 * Useful core for extracting movie title from page title
 */
function TitleExtractor() {
  'use strict';
  this.extractors = {}
}

TitleExtractor.prototype.register = function (domain, callback) {
  'use strict';
  this.extractors[domain] = callback
}

TitleExtractor.prototype.extract = function (domain, text) {
  'use strict';
  var res = text
  var extractor
  for (var e in this.extractors) {
    if (domain.indexOf(e) !== -1) {
      extractor = this.extractors[e]
      break
    }
  }
  if (extractor) res = extractor(text)
  return res
}

// Bring the default instance
var titleExtractor = new TitleExtractor()
