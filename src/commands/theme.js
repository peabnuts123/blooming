const terminal = require('../terminal');

module.exports = {
  aliases: ['theme'],
  description: "Toggle the theme between light and dark",
  usage: ['theme'],
  help() {
    terminal.print("Toggle the current display theme. Currently there are just light/dark themes so this command toggles between the two.");
  },
  func() {
    terminal.toggleTheme();
    // @NOTE hacks. See `prompt.js`
    global.reloadPrompt();
    terminal.clear();
    terminal.print("(Cleared terminal)");
    terminal.print(terminal.style.message(`Switched terminal theme '${terminal.style.name}'.`));
  },
};
