const terminal = require('../terminal');
const garden = require('../garden/garden');

module.exports = {
  aliases: ['garden'],
  description: "",
  usage: ['garden', 'garden [index]'],
  help() {
  },
  func([index]) {
    // Ensure garden plants are up to date
    garden.updatePlantMaturities();
    
    if (index) {
      // Check if index is a numeric value
      if (!isNaN(index) && isFinite(index)) {
        // Check if index is within bounds
        if (index < garden.getSize() && index >= 0) {
          // Get summary for item at index `index`
          let gardenItem = garden.getPlantInSlotIndex(index);

          // @TODO maybe don't need this command
          terminal.print(`${gardenItem.getName()}: ${gardenItem.getStageSummary()}`);
        } else {
          terminal.print(`Invalid index: ${index}. Garden only has slots 0-${garden.getSize() - 1}`);
        }
      } else {
        terminal.print(`Invalid index: '${index}'. Please input a number e.g. garden 2`);
      }
    } else {
      // Display summary for all slots in garden
      let gardenItems = garden.getAllSlots();
      gardenItems.forEach((gardenItem, index) => {
        let slotName;
        let slotSummary;
        if (gardenItem !== undefined) {
          slotName = gardenItem.getName();
          if (!gardenItem.hasGoneToSeed()) {
            slotSummary = gardenItem.getStageSummary();
          } else {
            slotSummary = `@TODO gone to seed`;
          }
        } else {
          slotName = '[ Empty slot ]';
          slotSummary = ' -- ';
        }

        terminal.print(`[${index}] ${slotName}`);
        terminal.print(`\t${slotSummary}`);
      });
    }
  },
};
