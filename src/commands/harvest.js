const terminal = require('../terminal');
const garden = require('../garden/garden');
const inventory = require('../inventory/inventory');
const isNumeric = require('../util/isNumeric');
const SeedItem = require('../inventory/seed-item');
const FlowerItem = require('../inventory/flower-item');
const announceNewlyDiscoveredPlants = require('../util/announceNewlyDiscoveredSeeds');
const constants = require('../constants');


module.exports = {
  aliases: ['harvest'],
  description: "Harvest plants from the garden",
  usage: ['harvest [garden index]', 'harvest all'],
  help() {
    terminal.print("Harvest a plant growing in the garden. The items you receive will depend on how mature the plant is.");
    terminal.print("While a plant is mature i.e. flowering, you will receive seeds and flowers.");
    terminal.print("If a plant has gone to seed, you will receive more seeds, but no flowers.");
    terminal.print("If you harvest a plant before it is mature, you will only get a seed or two.");
    terminal.print(`E.g. ${terminal.style.help.alias('harvest 2')} - harvest the plant growing in slot 2 in the garden.`);
    terminal.print(`You may also specify ${terminal.style.help.alias('harvest all')} to harvest EVERYTHING in the garden. Be sure you want to do this!`);

  },
  func([gardenIndex]) {
    // Ensure garden plants are up to date
    garden.updatePlantMaturities();

    if (gardenIndex && gardenIndex.toLocaleLowerCase() === 'all') {
      // User specified "all" - harvest everything
      let allHarvestedItems = [];
      terminal.print("Harvested:");
      garden.getAllPlants().forEach((gardenItem) => {
        let harvestedItems = harvestGardenItem(gardenItem);
        allHarvestedItems.push(...harvestedItems);

        terminal.print(`\t${gardenItem.getName()} (${constants.STAGE_NAME['STAGE' + gardenItem.stage]})`);
      });

      // Combine common harvestedItems (sorry about the gnarly `reduce()`)
      let resultItemsGrouped = allHarvestedItems.reduce((currObj, nextItem) => {
        let itemKey = nextItem.inventoryItem.getName();
        if (itemKey in currObj) {
          currObj[itemKey].amount += nextItem.amount;
        } else {
          currObj[itemKey] = nextItem;
          // Also add same reference to an array
          currObj.collection.push(nextItem);
        }
        return currObj;
      }, { collection: [] }).collection;

      // Output result
      terminal.print(`Got:`);
      resultItemsGrouped.forEach((harvestedItem) => {
        terminal.print(`\t${harvestedItem.amount}x ${harvestedItem.inventoryItem.getName()}`);
      })

    } else if (gardenIndex === undefined) {
      // `gardenIndex` index is not provided
      terminal.error(`Cannot harvest. Missing garden slot index. See usage: ${terminal.style.help.usage('help harvest')}`);
    } else if (!isNumeric(gardenIndex)) {
      // Garden index is not a number
      terminal.error('Cannot harvest. Garden slot index is not valid - it must be a number');
    } else if (Number(gardenIndex) < 0 || Number(gardenIndex) >= garden.getSize()) {
      // Garden index is not in the right bounds
      terminal.error(`Cannot harvest. Garden slot index is not valid - it must be between 0 and ${garden.getSize() - 1}`);
    } else if (garden.isSlotEmpty(Number(gardenIndex))) {
      terminal.error(`Cannot harvest. Garden slot ${gardenIndex} is empty`);
    } else {
      // Garden index is a valid number now
      let gardenItem = garden.getPlantInSlotIndex(Number(gardenIndex));

      // Harvest item from garden
      let harvestedItems = harvestGardenItem(gardenItem);

      // Output result
      terminal.print(`Harvested: ${gardenItem.getName()} (${constants.STAGE_NAME['STAGE' + gardenItem.stage]})`);
      terminal.print(`Got:`);
      harvestedItems.forEach((harvestedItem) => {
        terminal.print(`\t${harvestedItem.amount}x ${harvestedItem.inventoryItem.getName()}`);
      })

      // Announce any newly identified plants
      announceNewlyDiscoveredPlants("\nYou've identified new plants!", [gardenItem.getPlantId()]);
    }
  },
};

function harvestGardenItem(gardenItem) {
  // Generate payload from garden item
  let harvestPayload = gardenItem.generateHarvestPayload();
  // Add X and Y numbers of each seeds and flowers, governed by the harvest payload
  let harvestedItems = [];
  for (let i = 0; i < harvestPayload.numSeeds; i++) {
    let newItem = inventory.add(harvestPayload.plantInfo, SeedItem);

    if (i === 0) {
      harvestedItems.push({
        inventoryItem: newItem,
        amount: harvestPayload.numSeeds,
      });
    }
  }
  for (let i = 0; i < harvestPayload.numFlowers; i++) {
    let newItem = inventory.add(harvestPayload.plantInfo, FlowerItem);
    if (i === 0) {
      harvestedItems.push({
        inventoryItem: newItem,
        amount: harvestPayload.numFlowers,
      });
    }
  }

  // Remove the garden item from the garden
  garden.removeGardenItem(gardenItem);

  return harvestedItems;
}