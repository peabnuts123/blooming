const chalk = require('chalk').default;

const { state, saveState } = require('./state');

/**
 * Abstraction over terminal output to simplify common tasks such as printing with color, backgrounds, etc.
 */
class Terminal {
  constructor() {
    this._themes = {
      dark: {
        name: 'Dark',
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
          alias: (alias) => {
            return this.style.command(alias);
          },
        },
      },
      light: {
        name: 'Light',
        message: chalk.blueBright,
        command: chalk.magenta,
        error: chalk.redBright,
        prompt: chalk.bgYellowBright.magentaBright.bold,
        inventory: {
          unidentifiedItem: chalk.magenta,
          seedItem: chalk.yellow,
          flowerItem: chalk.green,
        },
        garden: {
          emptySlot: chalk.gray,
          plantName: chalk.green,
          unidentifiedPlant: chalk.magenta,
          timeRemaining: chalk.gray,
        },
        help: {
          usage: (usage) => {
            return this.style.command(usage.replace(/\[[^\]]*\]/g, (match) => this.style.message(match)));
          },
          alias: (alias) => {
            return this.style.command(alias);
          },
        },
      },
    }

    this._deserialise(state.terminal);
  }

  print(...messages) {
    console.log(...messages);
  }

  error(...messages) {
    console.log(`${this.style.error(messages.join(' '))}`);
  }

  clear() {
    console.clear();
  }

  toggleTheme() {
    if (this._theme === 0) {
      this._setTheme(1);
    } else {
      this._setTheme(0);
    }

    this._saveState();
  }

  _setTheme(themeIndex) {
    switch (themeIndex) {
      case 0:
        this.style = this._themes.dark;
        break;
      case 1:
        this.style = this._themes.light;
        break;
      default:
        throw new Error(`Unhandled terminal theme: ${themeIndex}`);
    }

    this._theme = themeIndex;
  }

  _deserialise(terminalState) {
    this._setTheme(terminalState.theme);
  }

  _saveState() {
    state.terminal = this._serialise();
    saveState();
  }

  _serialise() {
    return {
      theme: this._theme,
    };
  }
}

module.exports = new Terminal();
