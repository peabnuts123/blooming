const chalk = require('chalk').default;

const { state, saveState } = require('./state');

/**
 * Abstraction over terminal output to simplify common tasks such as printing with color, backgrounds, etc.
 */
class Terminal {
  constructor() {
    /**
     * Theme definitions for common styles.
     * They are defined here instead of a const because they need to reference `this.style`
     */
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

  /**
   * Print a series of messages to the terminal
   * @param {string[]} messages Messages to print
   */
  print(...messages) {
    console.log(...messages);
  }

  /**
   * Print a series of error messages to the terminal
   * @param {string[]} messages Errors to print
   */
  error(...messages) {
    console.log(`${this.style.error(messages.join(' '))}`);
  }

  /**
   * Clear the terminal screen
   */
  clear() {
    console.clear();
  }

  /**
   * Toggle the current theme between Dark and Light
   * This function will be removed if any more than 2 themes are ever added in the future.
   */
  toggleTheme() {
    if (this._theme === 0) {
      this._setTheme(1);
    } else {
      this._setTheme(0);
    }

    this._saveState();
  }

  /**
   * @private
   * Set the current terminal corresponding to the `themeIndex` parameter
   * @param {number} themeIndex Corresponding index to set the theme to
   */
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

  /**
   * @private
   * Deserialise the terminal state from disk (JSON)
   * @param {object} discoveryState Raw discovery state object from disk
   */
  _deserialise(terminalState) {
    this._setTheme(terminalState.theme);
  }

  /**
   * @private
   * Save the current terminal state to disk
   */
  _saveState() {
    state.terminal = this._serialise();
    saveState();
  }

  /**
   * @private
   * Convert the current terminal state into a JSON object for storing on disk
   * @returns {object}
   */
  _serialise() {
    return {
      theme: this._theme,
    };
  }
}

module.exports = new Terminal();
