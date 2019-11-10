const terminal = require('../terminal');
const inventory = require('../inventory/inventory');
const padString = require('../util/padString');
const findMax = require('../util/findMax');

module.exports = {
  aliases: ['inventory'],
  description: "List inventory or show information about an item in the inventory",
  usage: ['inventory', 'inventory [index]'],
  help() {
    terminal.print("Show information about either the whole inventory or information about an item in a specific index within the inventory.");
    terminal.print("Type `inventory` to show a list of all items.");
    terminal.print("Type `inventory [index]` to show more information about the item in index `[index]`.")
    terminal.print(`E.g. inventory 2`);
  },
  func([index]) {
    if (index) {
      // Check if index is a numeric value
      if (!isNaN(index) && isFinite(index)) {
        // Check if index is within bounds
        if (index < inventory.itemCount() && index >= 0) {
          // Get summary for item at index `index`
          let inventoryItem = inventory.getAtIndex(index);

          terminal.print(`${inventoryItem.getSeedName()}: ${inventoryItem.getSeedSummary()}`);
        } else {
          terminal.print(`Invalid index: ${index}. Inventory only has items 0-${inventory.itemCount() - 1}`);
        }
      } else {
        terminal.print(`Invalid index: '${index}'. Please input a number e.g. inventory 2`);
      }
    } else {
      // Display summary for all items in inventory
      let inventoryItems = inventory.getAllItems();
      let leftColumnWidth = findMax(inventoryItems, (inventoryItem) => inventoryItem.item.getSeedName().length) + 7;
      inventoryItems.forEach((inventoryItem, index) => {
        // Display index, item name, and amount of each item
        let str = `[${index}] ${inventoryItem.item.getSeedName()}`;
        str = padString(str, leftColumnWidth);
        str += `x${inventoryItem.amount}`;
        
        terminal.print(str);
      });
    }
  },
};
