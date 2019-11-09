const readline = require('readline');

const { getCommandByAlias } = require('./commands');
const terminal = require('./terminal');
const { state, saveState } = require('./state');
const constants = require('./constants');

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

// Last login
const currentTime = new Date();
const lastLoginTimeString = state.lastLoginTime;
state.lastLoginTime = currentTime.toISOString();
saveState();
if (lastLoginTimeString) {
  const lastLoginTime = new Date(lastLoginTimeString);
  terminal.print(`Welcome back! Last login: ${lastLoginTime.toLocaleString()}`);
} else {
  terminal.print(`Welcome to bloom! @TODO better welcome message`)
}

const lastLoginRewardTimeString = state.lastLoginRewardTime;
if (lastLoginRewardTimeString) {
  const lastLoginRewardTime = new Date(lastLoginRewardTimeString);
  const secondsSinceLastReward = (currentTime - lastLoginRewardTime) / 1000;
  if (secondsSinceLastReward > constants.SEED_REWARD_MIN_INTERVAL_SECONDS) {
    giveLoginReward();
  }
} else {
  giveLoginReward();
}

function giveLoginReward() {
  console.log('[DEBUG] @TODO I O U one reward');
  state.lastLoginRewardTime = currentTime.toISOString();
  saveState();
}


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
