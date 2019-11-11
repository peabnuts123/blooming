const terminal = require('../terminal');
const garden = require('../garden/garden');
const inventory = require('../inventory/inventory');
const isNumeric = require('../util/isNumeric');
const SeedItem = require('../inventory/seed-item');
const FlowerItem = require('../inventory/flower-item');
const announceNewlyDiscoveredPlants = require('../util/announceNewlyDiscoveredSeeds');


module.exports = {
  aliases: ['harvest'],
  description: "Harvest a plant from the garden in its current state",
  usage: ['harvest [garden index]'],
  help() {
    terminal.print("@TODO help!");
  },
  func([gardenIndex]) {
    // Ensure garden plants are up to date
    garden.updatePlantMaturities();

    if (gardenIndex === undefined) {
      // `gardenIndex` index is not provided
      terminal.print('Cannot harvest. Missing garden slot index. See usage: help harvest')
    } else if (!isNumeric(gardenIndex)) {
      // Garden index is not a number
      terminal.print('Cannot harvest. Garden slot index is not valid - it must be a number');
    } else if (Number(gardenIndex) < 0 || Number(gardenIndex) >= garden.getSize()) {
      // Garden index is not in the right bounds
      terminal.print(`Cannot harvest. Garden slot index is not valid - it must be between 0 and ${garden.getSize() - 1}`);
    } else if (garden.isSlotEmpty(Number(gardenIndex))) {
      terminal.print(`Cannot harvest. Garden slot ${gardenIndex} is empty`);
    } else {
      // Garden index is a valid number now
      let gardenItem = garden.getPlantInSlotIndex(Number(gardenIndex));

      // Generate payload from garden item
      let harvestPayload = gardenItem.generateHarvestPayload();
      // Add X and Y numbers of each seeds and flowers, governed by the harvest payload
      let seedInventoryItem;
      let flowerInventoryItem;
      for (let i = 0; i < harvestPayload.numSeeds; i++) {
        seedInventoryItem = inventory.add(harvestPayload.plantInfo, SeedItem);
      }
      for (let i = 0; i < harvestPayload.numFlowers; i++) {
        flowerInventoryItem = inventory.add(harvestPayload.plantInfo, FlowerItem);
      }

      // Remove the garden item from the garden
      garden.removeGardenItem(gardenItem);

      // Output effects
      // @TODO define some constant stage names for garden items
      let debug_stageName = 'stage ' + gardenItem.stage;
      terminal.print(`Harvested '${gardenItem.getName()}' (${debug_stageName})`);
      terminal.print(`Got:`);
      if (seedInventoryItem) {
        terminal.print(`\t${harvestPayload.numSeeds}x ${seedInventoryItem.getName()}`);
      }
      if (flowerInventoryItem) {
        terminal.print(`\t${harvestPayload.numFlowers}x ${flowerInventoryItem.getName()}`);
      }

      // Announce any newly identified plants
      announceNewlyDiscoveredPlants("\nYou've identified new plants!", [gardenItem.getPlantId()]);
    }
  },
};
