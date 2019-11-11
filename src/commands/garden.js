const terminal = require('../terminal');
const garden = require('../garden/garden');
const announceNewlyDiscoveredPlants = require('../util/announceNewlyDiscoveredSeeds');

module.exports = {
  aliases: ['garden'],
  description: "View what's currently growing in the garden",
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
      let timeRemaining = '';
      if (gardenItem !== undefined) {
        // Slot name
        slotName = gardenItem.getName();

        // Time remaining
        const secondsUntilNextMaturity = gardenItem.secondsUntilNextMaturity();
        timeRemaining = ' - Next growth: ';
        if (secondsUntilNextMaturity > 3600) {
          timeRemaining += `${Math.floor(secondsUntilNextMaturity / 3600)}h `;
        }
        if (secondsUntilNextMaturity > 60) {
          timeRemaining += `${Math.floor((secondsUntilNextMaturity % 3600) / 60)}m `;
        }
        timeRemaining += `${Math.floor(secondsUntilNextMaturity % 60)}s`;

        // Slot summary
        if (!gardenItem.hasGoneToSeed()) {
          slotSummary = gardenItem.getStageSummary();
        } else {
          slotSummary = `@TODO gone to seed`;
        }
      } else {
        slotName = '[ Empty slot ]';
        slotSummary = ' -- ';
      }

      terminal.print(`[${index}] ${slotName}${timeRemaining}`);
      terminal.print(`\t${slotSummary}`);

    });

    // Announce any newly identified plants
    announceNewlyDiscoveredPlants("\nYou've identified new plants!");
  },
};
