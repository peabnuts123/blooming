const stringLength = require('string-length').default;

const constants = require('./constants');
const { getRandomPlantInfo } = require('./data-types/seeds');
const garden = require('./garden/garden');
const inventory = require('./inventory/inventory');
const SeedItem = require('./inventory/seed-item');
const prompt = require('./prompt');
const { state, saveState } = require('./state');
const terminal = require('./terminal');
const findMax = require('./util/findMax');
const padString = require('./util/padString');
const announceNewlyDiscoveredPlants = require('./util/announceNewlyDiscoveredSeeds');



// Update plants in the garden
garden.updatePlantMaturities();

// LAST LOGIN TIME
const currentTime = new Date();
const lastLoginTimeString = state.lastLoginTime;
state.lastLoginTime = currentTime.toISOString();
const hasPlayedBefore = !!lastLoginTimeString;
saveState();
if (hasPlayedBefore) {
  const lastLoginTime = new Date(lastLoginTimeString);
  terminal.print(`Welcome back! Last login: ${lastLoginTime.toLocaleString()}`);
  terminal.print();
} else {
  terminal.print(`Welcome to bloom!`);
  terminal.print(terminal.style.message(`Looks like this is your first time here. Try typing '${terminal.style.command('help')}' to see what commands there are. Have fun!`));
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

/**
 * Give the player a login reward of a random amount of random seeds
 */
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
    let newSeed = getRandomPlantInfo();
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
    terminal.print(terminal.style.message("It's been a while since you were last here! You got some new seeds:"));
  } else {
    terminal.print(terminal.style.message("Here are some seeds to start you off. They might not look like much yet, but plant them and see what grows!"));
  }

  let leftColumnWidth = findMax(rewardSeeds, (rewardSeedEntry) => stringLength(rewardSeedEntry.seed.getSeedName())) + 10;
  rewardSeeds.forEach((rewardSeedEntry) => {
    terminal.print(`\t${padString(terminal.style.inventory.seedItem(rewardSeedEntry.seed.getSeedName()), leftColumnWidth)}x${rewardSeedEntry.amount}`);
  });
  terminal.print();
}

// Announce plants that discovered while player was away
announceNewlyDiscoveredPlants("You've identified new plants since you visited!");

// Begin prompt
prompt.begin();
