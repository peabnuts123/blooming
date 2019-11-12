const stringLength = require('string-length').default;

const terminal = require('../terminal');
const inventory = require('../inventory/inventory');
const padString = require('../util/padString');
const findMax = require('../util/findMax');
const isNumeric = require('../util/isNumeric');

module.exports = {
  aliases: ['inventory'],
  description: "List inventory or show information about an item in the inventory",
  usage: ['inventory', 'inventory [index]'],
  help() {
    terminal.print("Show information about the whole inventory, or information about a specific item in the inventory.");
    terminal.print(`Type ${terminal.style.help.alias('inventory')} to show a list of all items.`);
    terminal.print(`Type ${terminal.style.help.usage('inventory [index]')} to show more information about the item at index ${terminal.style.help.usage('[index]')}.`)
    terminal.print(`E.g. ${terminal.style.help.alias('inventory 2')}`);
  },
  func([index]) {
    if (index) {
      // Check if index is a numeric value
      if (isNumeric(index)) {
        // Check if index is within bounds
        if (index < inventory.itemCount() && index >= 0) {
          // Get summary for item at index `index`
          let inventoryItem = inventory.getAtIndex(index);

          terminal.print(`${inventoryItem.getName()}: ${inventoryItem.getSummary()}`);
        } else {
          terminal.error(`Invalid index: ${terminal.style.command(index)}. Inventory only has items 0-${inventory.itemCount() - 1}`);
        }
      } else {
        terminal.error(`Invalid index: '${terminal.style.command(index)}'. Please input a number e.g. ${terminal.style.command('inventory 2')}`);
      }
    } else {
      // Display summary for all items in inventory
      let inventoryItems = inventory.getAllItems();
      let leftColumnWidth = findMax(inventoryItems, (inventoryItem) => stringLength(inventoryItem.getName())) + 7;
      inventoryItems.forEach((inventoryItem, index) => {
        // Display index, item name, and amount of each item
        let str = `[${terminal.style.command(index)}] ${inventoryItem.getName()}`;
        str = padString(str, leftColumnWidth);
        str += `x${inventoryItem.amount}`;

        terminal.print(str);
      });
    }
  },
};
