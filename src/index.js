const readline = require('readline');

const { getCommandByAlias } = require('./commands');
const constants = require('./constants');
const { getSeedItemById, getRandomSeed } = require('./data-types/seeds');
const inventory = require('./inventory/inventory');
const { state, saveState } = require('./state');
const terminal = require('./terminal');
const findMax = require('./util/findMax');
const padString = require('./util/padString');

// Mark daffodil is discovered  @TODO @DEBUG REMOVE
const discovery = require('./discovery');
discovery.markSeedAsDiscovered(getSeedItemById('daffodil').getId());


// LAST LOGIN
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


// LAST LOGIN REWARD
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
  // Save current time as last reward time
  state.lastLoginRewardTime = currentTime.toISOString();
  saveState();

  // Generate a random amount of random seeds
  const min = 2;
  const max = 5;
  const numRewardSeeds = min + Math.floor(Math.random() * ((max - min) + 1));
  let rewardSeeds = {};
  for (let i = 0; i < numRewardSeeds; i++) {
    let newSeed = getRandomSeed();
    // Add random seed to inventory
    inventory.add(newSeed);

    // Ensure rewardSeeds object has this seed type in it
    if (!(newSeed.getId() in rewardSeeds)) {
      rewardSeeds[newSeed.getId()] = {
        seed: newSeed,
        amount: 0,
      };
    }
    // Increment amount for this seed type
    rewardSeeds[newSeed.getId()].amount++;
  }

  // Quickly convert our object into an array
  rewardSeeds = Object.keys(rewardSeeds).map((seedId) => rewardSeeds[seedId]);

  // Print out seeds awarded
  terminal.print("It's been a while since you were last here! You've been awarded new seeds.")
  terminal.print("You got:")
  let leftColumnWidth = findMax(rewardSeeds, (rewardSeedEntry) => rewardSeedEntry.seed.getName().length) + 10;
  rewardSeeds.forEach((rewardSeedEntry) => {
    terminal.print(`    ${padString(rewardSeedEntry.seed.getName(), leftColumnWidth)}x${rewardSeedEntry.amount}`)
  });
  terminal.print();
}


// PROMPTING
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'bloom> '
});

rl.prompt();

rl.on('line', (userInput) => {
  let [command, ...args] = userInput.split(/\s+/g);

  // Lookup command by alias
  let commandDefinition = getCommandByAlias(command);
  if (commandDefinition) {
    // Execute command if it was found
    commandDefinition.func(args);
  } else {
    terminal.print("Command not recognised");
  }

  // Log newline after every command
  terminal.print();
  rl.prompt();
});
