const chalk = require('chalk').default;

/**
 * Abstraction over terminal output to simplify common tasks such as printing with color, backgrounds, etc.
 */
class Terminal {
  constructor() {
    this.style = {
      message: chalk.yellowBright,
      command: chalk.magentaBright,
      error: chalk.redBright,
      prompt: chalk.bgMagentaBright.yellowBright.bold,
      inventory: {
        unidentifiedItem: chalk.yellow,
        seedItem: chalk.blue,
        flowerItem: chalk.green,
      },
      garden: {
        emptySlot: chalk.gray,
        plantName: chalk.green,
        unidentifiedPlant: chalk.yellow,
        timeRemaining: chalk.gray,
      },
      help: {
        usage: (usage) => {
          return this.style.command(usage.replace(/\[[^\]]*\]/g, (match) => this.style.message(match)));
        },
        alias: (alias) => this.style.command(alias),
      },
    };
  }

  print(...messages) {
    console.log(...messages);
  }

  error(...messages) {
    console.log(`${this.style.error(messages.join(' '))}`);
  }
}

module.exports = new Terminal();
