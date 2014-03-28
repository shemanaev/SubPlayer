
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
  if (domain in this.extractors) res = this.extractors[domain](text)
  return res
}

// Bring the default instance
var titleExtractor = new TitleExtractor()
