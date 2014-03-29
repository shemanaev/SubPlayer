/*global
  titleExtractor,
*/
function ExUaExtract(text) {
  'use strict';

  return text.replace(/ - (.*) @ ex\.ua/i, '')
}

titleExtractor.register('ex.ua', ExUaExtract)
