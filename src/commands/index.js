const stringLength = require('string-length').default;

const terminal = require('../terminal');
const padString = require('../util/padString');
const findMax = require('../util/findMax');

// Commands
const exitCommand = require('./exit');
const inventoryCommand = require('./inventory');
const gardenCommand = require('./garden');
const plantCommand = require('./plant');
const harvestCommand = require('./harvest');
const themeCommand = require('./theme');

/**
 * All commands available from the CLI
 */
const commands = [
  // Help command has intentional circular dependencies so must be define in-line
  {
    aliases: ['help'],
    description: "Print this help message or more information about a command",
    usage: ['help', 'help [command]'],
    help() {
      terminal.print("Show information about all available commands or show more information about a particular command.");
      terminal.print(`Type ${terminal.style.command('help')} by itself for a list of commands.`)
      terminal.print(`Type ${terminal.style.help.usage('help [command]')} for information about a specific command.`)
      terminal.print(`E.g. ${terminal.style.help.usage('help inventory')}`);
    },
    func([commandAlias]) {
      if (commandAlias) {
        // Look up a specific command
        let commandDefinition = getCommandByAlias(commandAlias);
        if (commandDefinition) {
          // Print usage and execute help function (which is assumed to print some more help)
          terminal.print(`Aliases: ${commandDefinition.aliases.map(terminal.style.help.alias).join(', ')}`);
          terminal.print(`Usage: ${commandDefinition.usage.map(terminal.style.help.usage).join(', ')}`);
          terminal.print();
          commandDefinition.help();
        } else {
          // Passed-in command alias not found
          terminal.error(`Can't find a command called '${commandAlias}'`);
        }
      } else {
        // Print help for all commands
        let sortedCommands = commands.slice().sort((commandA, commandB) => {
          return commandA.usage.join(', ').localeCompare(commandB.usage.join(', '));
        });
        terminal.print("Commands:")
        let leftColumnWidth = findMax(sortedCommands, (commandDefinition) => stringLength(commandDefinition.usage.join(', '))) + 5;
        sortedCommands.forEach((commandDefinition) => {
          let str = '\t' + commandDefinition.usage.map(terminal.style.help.usage).join(', ');
          str = padString(str, leftColumnWidth);
          str += commandDefinition.description;
          terminal.print(str);
        });
      }
    },
  },
  inventoryCommand,
  exitCommand,
  gardenCommand,
  plantCommand,
  harvestCommand,
  themeCommand,
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
 * Autocompletion function for tab autocomplete in the terminal.
 * Fetch a list of possible aliases that start with what the user has typed.
 * @param {string} line User input from terminal
 */
function autoCompleteFunction(line) {
  let validAliases = [];
  commands.forEach((commandDefinition) => {
    commandDefinition.aliases.forEach((alias) => {
      if (alias.toLocaleLowerCase().startsWith(line.toLocaleLowerCase())) {
        validAliases.push(alias);
      }
    });
  });

  return [validAliases, line];
}

module.exports = {
  commands,
  getCommandByAlias,
  autoCompleteFunction,
}
