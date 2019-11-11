const terminal = require('../terminal');
const garden = require('../garden/garden');

module.exports = {
  aliases: ['garden'],
  description: "",
  usage: ['garden'],
  help() {
    terminal.print("@TODO help!");
  },
  func() {
    // Ensure garden plants are up to date
    garden.updatePlantMaturities();

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
  },
};
