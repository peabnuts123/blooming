const inventory = require('./inventory/inventory');
const terminal = require('./terminal');

/**
 * All commands available from the CLI
 * @TODO should some of these be conditional? i.e. only available in certain situations?
 */
const commands = [
  {
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
  },
  {
    aliases: ['help'],
    description: "Print this help message or more information about a command",
    usage: ['help', 'help [command]'],
    help() {
      terminal.print("Show information about all available commands or show more information about a particular command.");
      terminal.print("Type `help` by itself for a list of commands.")
      terminal.print("Type `help [command]` for information about a specific command.")
      terminal.print("E.g. `help inventory`");
    },
    func([commandAlias]) {
      if (commandAlias) {
        // Look up a specific command
        let commandDefinition = getCommandByAlias(commandAlias);
        if (commandDefinition) {
          // Print usage and execute help function (which is assumed to print some more help)
          terminal.print(`Aliases: ${commandDefinition.aliases.join(', ')}`);
          terminal.print(`Usage: ${commandDefinition.usage.join(', ')}`);
          commandDefinition.help();
        } else {
          // Passed-in command alias not found
          terminal.print(`Can't find a command called '${commandAlias}'`);
        }
      } else {
        // Print help for all commands
        terminal.print("Commands:")
        let leftColumnWidth = 50;
        commands.forEach((commandDefinition) => {
          let str = "    " + commandDefinition.usage.join(', ') + "    ";
          str = padString(str, leftColumnWidth);
          str += commandDefinition.description;
          terminal.print(str);
        });
      }
    },
  },
  {
    aliases: ['inventory'],
    description: "List inventory or show information about an item in the inventory (@NOTE: Not yet implemented)",
    usage: ['inventory', 'inventory [index]'],
    help() {
      terminal.print("Show information about either the whole inventory or information about an item in a specific index within the inventory.");
      terminal.print("Type `inventory` to show a list of all items.");
      terminal.print("Type `inventory [index]` to show more information about the item in index `[index]`.")
      terminal.print(`E.g. inventory 2`);
    },
    func([index]) {
      if (index) {
        // Check if index is a numeric value
        if (!isNaN(index) && isFinite(index)) {
          // Check if index is within bounds
          if (index < inventory.itemCount() && index >= 0) {
            let inventoryItem = inventory.getAtIndex(index);
            terminal.print(`${inventoryItem.getName()}: ${inventoryItem.getSummary()}`);
          } else {
            terminal.print(`Invalid index: ${index}. Inventory only has items 0-${inventory.itemCount() - 1}`);
          }
        } else {
          terminal.print(`Invalid index: '${index}'. Please input a number e.g. inventory 2`);
        }
      } else {
        let inventoryItems = inventory.getAllItems();
        let leftColumnWidth = 50;
        inventoryItems.forEach((inventoryItem, index) => {
          let str = `[${index}] ${inventoryItem.item.getName()}`;
          str = padString(str, leftColumnWidth);
          str += `x${inventoryItem.amount}`;
          terminal.print(str);
        });
      }
    },
  },
  // {
  //   aliases: [],
  //   description: "",
  //   usage: [],
  //   help() {
  //    
  //   }
  //   func(args) {
  //    
  //   },
  // },
];

/**
 * Look up a command definition object for a given alias. If no commands match the given alias,
 * nothing is returned.
 * @param {string} alias Command alias
 */
function getCommandByAlias(alias) {
  return commands.find((commandDefinition) => {
    // Find a command definition where at least 1 alias is equal to the `alias` param
    return commandDefinition.aliases.some((cmdAlias) => cmdAlias.toLocaleLowerCase() == alias.toLocaleLowerCase());
  });
}

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

module.exports = {
  commands,
  getCommandByAlias,
}