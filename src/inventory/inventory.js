const { state, saveState } = require('../state');
const InventoryItem = require('./inventory-item'); // eslint-disable-line no-unused-vars
const SeedItem = require('./seed-item');

/**
 * Collection of all inventory item constructors
 */
const ALL_CONSTRUCTORS = [SeedItem];

/**
 * The player's inventory; what items they have.
 */
class Inventory {
  constructor() {
    /** @type {InventoryItem[]} */
    this._items = [];
    // Re-hydrate state from disk
    this._deserialise(state.inventory);
  }

  /**
   * @private
   * Look up an equivalent inventory item by item
   * @param {any} item Non inventory-item object to search by
   * @returns {InventoryItem}
   */
  _findInventoryItem(item) {
    return this._items.find((inventoryItem) => inventoryItem.isItem(item));
  }

  /**
   * Add a new or existing item to the inventory
   * @param {any} item Item to add to the inventory
   * @param {new () => InventoryItem} ItemType Constructor for inventory item type (e.g. `SeedItem`)
   * @return {InventoryItem} Inventory item that was added
   */
  add(item, ItemType) {
    // Ensure item is present in inventory
    let inventoryItem = this._findInventoryItem(item);
    if (inventoryItem === undefined) {
      inventoryItem = new ItemType(item);
      this._items.push(inventoryItem);
    }

    // Amend amount
    inventoryItem.amount++;

    // Persist changes to disk
    this._saveState();

    return inventoryItem;
  }

  /**
   * Remove an existing item from the inventory
   * @param {any} item Item to remove from the inventory
   */
  remove(item) {
    // Look up inventory item
    const inventoryItem = this._findInventoryItem(item);
    // Validate there is an inventory item to update
    if (inventoryItem === undefined) {
      throw new Error("Cannot remove item from inventory; it is not in the inventory");
    }

    // Reduce the amount of this item
    inventoryItem.amount--;

    // If there are now none of this item, remove this item
    if (inventoryItem.amount === 0) {
      this._items.splice(this._items.indexOf(inventoryItem), 1);
    }

    // Persist changes to disk
    this._saveState();
  }

  /**
   * Get the inventory item at the specified index
   * @param {number} index Index to retrieve item from
   * @returns {InventoryItem}
   */
  getAtIndex(index) {
    return this._items[index];
  }

  /**
   * The number of different types of item currently in the inventory.
   * NOT the total amount of items in the inventory.
   * @returns {number}
   */
  itemCount() {
    return this._items.length;
  }

  /**
   * Get the entire set of InventoryItems
   * @returns {InventoryItem[]}
   */
  getAllItems() {
    return this._items;
  }

  /**
   * @private
   * Save the current state of the inventory to disk
   */
  _saveState() {
    state.inventory = this._serialise();
    saveState();
  }

  /**
   * @private
   * Convert the current inventory state into a JSON object for storing on disk
   * @returns {object}
   */
  _serialise() {
    return {
      // Map (id, amount) for each item entry
      items: this._items.map((itemEntry) => itemEntry.serialise()),
    };
  }

  /**
   * @private
   * Deserialise the inventory state from disk (JSON) into proper types
   * @param {object} inventoryState Raw inventory state object from disk
   */
  _deserialise(inventoryState) {
    this._items = inventoryState.items.map((rawItem) => {
      let ItemType = this._getConstructorForType(rawItem._type);
      return ItemType.deserialise(rawItem);
    });
  }

  /**
   * @private
   * Look up an InventoryItem constructor for a given type string
   * @param {string} type Unique type string for a constructor
   */
  _getConstructorForType(type) {
    let constructor = ALL_CONSTRUCTORS.find((ctor) => ctor.getType() === type);
    if (constructor) {
      return constructor;
    } else {
      throw new Error(`Could not look up constructor for type '${type}'`);
    }
  }
}

module.exports = new Inventory();
