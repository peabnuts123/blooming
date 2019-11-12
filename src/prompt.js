const readline = require('readline');
const { getCommandByAlias, autoCompleteFunction } = require('./commands');

const terminal = require('./terminal');

/**
 * Class to manage prompting the player, the CLI
 */
class Prompt {
  constructor() {
    // PROMPTING
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: autoCompleteFunction,
    });

    this._rl = rl;
    // @NOTE hacks. stuff needs to update the prompt.
    // BUT, stuff can't reference the prompt from a dependency of the prompt
    //  which rules out terminal and any command ... which is basically the whole app, so ...
    global.reloadPrompt = this.reloadPrompt.bind(this);

    this.reloadPrompt();
  }

  /**
   * Begin prompting the player
   */
  begin() {
    this._rl.prompt();

    this._rl.on('line', (userInput) => {
      let [command, ...args] = userInput.trim().split(/\s+/g);

      // Lookup command by alias
      let commandDefinition = getCommandByAlias(command);
      if (commandDefinition) {
        // Execute command if it was found
        commandDefinition.func(args);
      } else {
        terminal.print(terminal.style.error("Command not recognised"));
      }

      // Log newline after every command
      terminal.print();
      this._rl.prompt();
    });
  }

  /**
   * Reload the prompt text from the current terminal theme
   */
  reloadPrompt() {
    this._rl.setPrompt(terminal.style.prompt('bloom>') + ' ');
  }
}

module.exports = new Prompt();
