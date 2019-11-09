const readline = require('readline');

const commands = require('./commands');
const terminal = require('./terminal');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'bloom> '
});

rl.prompt();

rl.on('line', (userInput) => {
  let commandDefinition;
  let commandFound = false;

  // Find command that matches input
  for (let i = 0; i < commands.length; i++) {
    commandDefinition = commands[i];

    // If user input matches one of this commands aliases, execute it
    if (commandDefinition.aliases.some((alias) => alias.toLocaleLowerCase() == userInput.toLocaleLowerCase())) {
      // Execute command
      commandDefinition.func();

      // Stop processing
      commandFound = true;
      break;
    }
  }

  // Log a warning if no commands matched
  if (!commandFound) {
    terminal.print("Command not recognised");
  }

  rl.prompt();
});
