const terminal = require('../terminal');
const isNumeric = require('../util/isNumeric');
const inventory = require('../inventory/inventory');
const garden = require('../garden/garden');
const SeedItem = require('../inventory/seed-item');


module.exports = {
  aliases: ['plant'],
  description: "Plant a seed into the garden",
  usage: ['plant [inventory index]'],
  help() {
    terminal.print("Plant a seed from the inventory into the garden.");
    terminal.print("Specify which seed to plant by using its index in the inventory.");
    terminal.print(`E.g. ${terminal.style.help.alias('plant 2')} - plant the seed at inventory slot 2 into the garden.`);
  },
  func([inventoryIndex]) {
    // Ensure garden plants are up to date
    garden.updatePlantMaturities();

    if (inventoryIndex === undefined) {
      // `inventoryIndex` index is not provided
      terminal.error(`Cannot plant. Missing inventory index. See usage: ${terminal.style.help.usage('help plant')}`)
    } else if (!isNumeric(inventoryIndex)) {
      // Inventory index is not a number
      terminal.error('Cannot plant. Inventory index is not valid - it must be a number');
    } else if (inventory.itemCount() === 0) {
      // Inventory is empty
      terminal.error(`Cannot plant. Inventory is empty`);
    } else if (Number(inventoryIndex) < 0 || Number(inventoryIndex) >= inventory.itemCount()) {
      // Inventory index is not in the right bounds
      terminal.error(`Cannot plant. Inventory index is not valid - it must be between 0 and ${inventory.itemCount() - 1}`);
    } else if (garden.getNumEmptySlots() <= 0) {
      // Garden is full
      terminal.error("Cannot plant. Garden is full");
    } else {
      // Arguments are present and valid (except the inventory index might not be referring to a seed)
      const inventoryItem = inventory.getAtIndex(Number(inventoryIndex));

      if (!(inventoryItem instanceof SeedItem)) {
        terminal.error(`Cannot plant. Item at index ${inventoryIndex} is not a seed: ${inventoryItem.getName()}`);
      } else {
        // Alright now we're ready to plant!
        let plantedSlotIndex = garden.plantSeed(inventoryItem.getPlantInfo());
        inventory.remove(inventoryItem);
        terminal.print(`Successfully planted ${inventoryItem.getName()} into garden slot ${plantedSlotIndex}. Remaining stock: ${inventoryItem.amount}`);
      }
    }
  },
};
