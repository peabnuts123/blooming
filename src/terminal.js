/**
 * Abstraction over terminal output to simplify common tasks such as printing with color, backgrounds, etc.
 */
class Terminal {
  print(...messages) {
    console.log(...messages);
  }
}

module.exports = new Terminal();
