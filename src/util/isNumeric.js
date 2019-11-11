/**
 * Test whether a string is a real, actual number e.g. "2", "-20"
 * @param {string} str String to test
 */
function isNumeric(str) {
  return !isNaN(str) && isFinite(str)
}

module.exports = isNumeric;
