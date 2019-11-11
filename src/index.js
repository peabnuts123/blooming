const readline = require('readline');

const { getCommandByAlias, autoCompleteFunction } = require('./commands');
const constants = require('./constants');
const { getRandomSeed } = require('./data-types/seeds');
const garden = require('./garden/garden');
const inventory = require('./inventory/inventory');
const SeedItem = require('./inventory/seed-item');
const { state, saveState } = require('./state');
const terminal = require('./terminal');
const findMax = require('./util/findMax');
const padString = require('./util/padString');
const announceNewlyDiscoveredPlants = require('./util/announceNewlyDiscoveredSeeds');



// Update plants in the garden
garden.updatePlantMaturities();

// LAST LOGIN
const currentTime = new Date();
const lastLoginTimeString = state.lastLoginTime;
state.lastLoginTime = currentTime.toISOString();
const hasPlayedBefore = !!lastLoginTimeString;
saveState();
if (hasPlayedBefore) {
  const lastLoginTime = new Date(lastLoginTimeString);
  terminal.print(`Welcome back! Last login: ${lastLoginTime.toLocaleString()}`);
} else {
  terminal.print(`Welcome to bloom! Looks like your first time here. Try typing 'help' to see what commands there are. Have fun!`);
}

terminal.print();

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

// Announce plants that discovered while player was away
announceNewlyDiscoveredPlants("You've identified new plants since you visited!");

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
    inventory.add(newSeed, SeedItem);

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
  if (hasPlayedBefore) {
    terminal.print("It's been a while since you were last here! You got some new seeds.");
  } else {
    terminal.print("Here are some seeds to start you off. They might not look like much yet, but plant them and see what grows!");
  }

  terminal.print("You got:");

  let leftColumnWidth = findMax(rewardSeeds, (rewardSeedEntry) => rewardSeedEntry.seed.getSeedName().length) + 10;
  rewardSeeds.forEach((rewardSeedEntry) => {
    terminal.print(`    ${padString(rewardSeedEntry.seed.getSeedName(), leftColumnWidth)}x${rewardSeedEntry.amount}`);
  });
  terminal.print();
}


// PROMPTING
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: autoCompleteFunction,
  prompt: 'bloom> '
});

rl.prompt();

rl.on('line', (userInput) => {
  let [command, ...args] = userInput.trim().split(/\s+/g);

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
