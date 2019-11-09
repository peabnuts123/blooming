const InventoryItem = require('./inventory-item');
const { state, saveState } = require('../state');
const { getSeedItemById } = require('../data-types/seeds');

/**
 * The player's inventory; what items they have.
 */
class Inventory {
  constructor() {
    // Re-hydrate state from disk
    this._deserialise(state.inventory);
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

    // Persist changes to disk
    this._saveState();
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

    // Persist changes to disk
    this._saveState();
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

  /**
   * Save the current state of the inventory to disk
   */
  _saveState() {
    state.inventory = this._serialise();
    saveState();
  }

  /**
   * Convert the current inventory state into JSON format for storing on disk
   */
  _serialise() {
    return {
      // Map (id, amount) for each item entry
      items: this._items.map((itemEntry) => {
        return {
          id: itemEntry.item.getId(),
          amount: itemEntry.amount,
        };
      }),
    };
  }

  /**
   * Deserialise the inventory state from disk (JSON) into proper types
   * @param {object} inventoryState Raw inventory state object from disk
   */
  _deserialise(inventoryState) {
    const items = [];
    inventoryState.items.forEach((item) => {
      let newItemEntry = this._createNewItemEntry(getSeedItemById(item.id));
      newItemEntry.amount = item.amount;
      items.push(newItemEntry);
    });

    this._items = items;
  }
}

module.exports = new Inventory();
