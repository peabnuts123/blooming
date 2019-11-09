const terminal = require('../terminal');

module.exports = {
  aliases: ['exit', 'quit'],
  description: "Exit the application",
  usage: ['exit'],
  help() {
    terminal.print("Exits the application.");
  },
  func() {
    terminal.print("See you later!");
    process.exit(0);
  },
};
