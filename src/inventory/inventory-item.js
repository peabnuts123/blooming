/**
 * An object currently in the inventory. It represents another object from a different domain,
 *  e.g. an unplanted seed, or harvested flowers, but with a common interface for use in displaying
 *  and interacting with the inventory.
 */
class InventoryItem {
  constructor() {
    /** @type {number} */
    this.amount = 0;
  }

  /**
   * Name to display in the inventory
   * @returns {string}
   * @override
   */
  getName() {
    throw new Error("Not implemented");
  }

  /**
   * Summary to display in the inventory
   * @returns {string}
   * @override
   */
  getSummary() {
    throw new Error("Not implemented");
  }

  /**
   * Used for equivalency testing a non-inventory-item with an
   * inventory item. E.g. to check whether a PlantInfo is represented
   * by a particular seed inventory item
   * @param {any} item Non-inventory-item object for checking against
   * @returns {boolean}
   * @override
   */
  isItem(/* item */) {
    throw new Error("Not implemented");
  }

  /**
   * Convert this item into a JSON representation for saving to disk
   * @returns {object}
   * @override
   */
  serialise() {
    return {
      amount: this.amount,
      _type: this.constructor.getType(),
    };
  }

  /**
   * Create a new instance of this item from JSON.
   * The `InventoryItem.deserialise` function should ONLY be called from inheriting sub-classes'
   *  deserialise implementations
   *
   * @param {InventoryItem} instance An already-instantiated instance of a subclass of InventoryItem, to modify
   * @param {object} rawItem The raw JSON object, from disk
   * @returns {InventoryItem}
   * @override
   */
  static deserialise(instance, rawItem) {
    // We're abusing JavaScript a bit so lets put a check in for
    //  accidental invocations. Sorry if you're converting this to TypeScript.
    if (arguments.length < 2) {
      throw new "static `deserialise` function likely not implemented";
    }

    instance.amount = rawItem.amount;
    return instance;
  }

  /**
   * Get a string constant representation for the type of this item.
   * This is used to determine what type an object was when deserialising from disk.
   * @returns {string}
   */
  static getType() {
    throw new Error("static `getType` function not implemented");
  }
}

module.exports = InventoryItem;
