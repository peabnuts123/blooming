const terminal = require('./terminal');

/**
 * All commands available from the CLI
 * @TODO should some of these be conditional? i.e. only available in certain situations?
 */
const commands = [
  {
    aliases: ['exit', 'quit'],
    description: "Exit the application",
    func() {
      terminal.print("See you later!");
      process.exit(0);
    },
  },
  {
    aliases: ['help', '/?'],
    description: "Print this help message",
    func() {
      terminal.print("Commands:")
      let leftColumnWidth = 30;
      commands.forEach((commandDefinition) => {
        let str = "    " + commandDefinition.aliases.join(', ') + "    ";
        str += new Array((leftColumnWidth - str.length) + 1).join(' ');
        str += commandDefinition.description;
        terminal.print(str);
      });
      terminal.print();
    },
  },
  {
    aliases: ['inventory'],
    description: "Show inventory (@NOTE: Not yet implemented)",
    func() {
      terminal.print("@TODO not yet implemented")
    },
  },
  // {
  //   aliases: [],
  //   description: "",
  //   func() {

  //   },
  // },
];

module.exports = commands;