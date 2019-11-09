const readline = require('readline');

const { getCommandByAlias } = require('./commands');
const terminal = require('./terminal');

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
