const readline = require('readline');

const { getCommandByAlias } = require('./commands');
const terminal = require('./terminal');

// @TODO @DEBUG REMOVE
const inventory = require('./inventory/inventory');
// @TODO un-comment to populate state
// const { getSeedItemById } = require('./data-types/seeds');
// for (let i = 0; i < 5; i++) {
//   inventory.add(getSeedItemById('daffodil'));
// }
// for (let i = 0; i < 3; i++) {
//   inventory.add(getSeedItemById('poppy'));
// }

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'bloom> '
});

rl.prompt();

rl.on('line', (userInput) => {
  let [command, ...args] = userInput.split(/\s+/g);

  let commandDefinition = getCommandByAlias(command);
  if (commandDefinition) {
    commandDefinition.func(args);
  } else {
    terminal.print("Command not recognised");
  }

  terminal.print();
  rl.prompt();
});
