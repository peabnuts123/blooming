/**
 * Ensure a string `str` is at least length `length` by padding it to the right with character `char`
 * 
 * @param {string} str The string to pad
 * @param {number} length The minimum length to pad the string to
 * @param {string} char The character to pad the string with (must be 1 character)
 */
function padString(str, length, char = ' ') {
  let paddingAmount = Math.max(0, length - str.length);
  let result = str;
  result += new Array(paddingAmount + 1).join(char);
  return result;
}

module.exports = padString;
