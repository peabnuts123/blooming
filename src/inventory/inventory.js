const InventoryItem = require('./inventory-item');

/**
 * The player's inventory; what items they have.
 */
class Inventory {
  constructor() {
    this._items = [];
  }

  _findItemEntry(item) {
    return this._items.find((itemEntry) => itemEntry.item.getId() === item.getId());
  }

  _createNewItemEntry(item) {
    return {
      item,
      amount: 0,
    };
  }

  add(item) {
    // Validate parameter type
    if (!(item instanceof InventoryItem)) {
      throw new Error("Cannot add non-inventory-item object to inventory: ");
    }

    // Ensure item entry is present in inventory
    let itemEntry = this._findItemEntry(item);
    if (itemEntry === undefined) {
      itemEntry = this._createNewItemEntry(item);
      this._items.push(itemEntry);
    }

    // Amend amount
    itemEntry.amount++;
  }

  remove(item) {
    // Validate parameter type
    if (!(item instanceof InventoryItem)) {
      throw new Error("Cannot remove non-inventory-item object from inventory");
    }

    // Look up inventory entry
    const itemEntry = this._findItemEntry(item);
    // Validate there is an inventory entry to update
    if (itemEntry === undefined) {
      throw new Error("Cannot remove item from inventory; it is not in the inventory");
    }

    // Reduce the amount of this item
    itemEntry.amount--;

    // If there are now none of this item, remove this entry
    if (itemEntry.amount === 0) {
      this._items.splice(this._items.indexOf(itemEntry), 1);
    }
  }

  getAtIndex(index) {
    return this._items[index].item;
  }

  itemCount() {
    return this._items.length;
  }

  getAllItems() {
    return this._items;
  }
}

module.exports = new Inventory();
