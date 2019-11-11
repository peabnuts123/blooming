const InventoryItem = require('./inventory-item');
const { getPlantInfoById } = require('../data-types/seeds');
const PlantInfo = require('../data-types/plant-info'); // eslint-disable-line no-unused-vars


/**
 * A seed item in the inventory
 */
class FlowerItem extends InventoryItem {
  /**
   * @param {PlantInfo} plantInfo
   */
  constructor(plantInfo) {
    super();

    /** @type {PlantInfo} */
    this._plantInfo = plantInfo;
  }

  /**
   * Name to display in the inventory
   * @returns {string}
   */
  getName() {
    return this._plantInfo.getFlowerName();
  }

  /**
   * Summary to display in the inventory
   * @returns {string}
   */
  getSummary() {
    return this._plantInfo.getFlowerSummary();
  }

  /**
   * Used for equivalency testing a non-inventory-item with an
   * inventory item. E.g. to check whether a PlantInfo is represented
   * by a particular seed inventory item
   * @param {any} item Non-inventory-item object for checking against
   * @returns {boolean}
   */
  isItem(item) {
    return item === this._plantInfo;
  }

  /**
   * Convert this item into a JSON representation for saving to disk
   * @returns {object}
   */
  serialise() {
    return Object.assign(super.serialise(), {
      id: this._plantInfo.getId(),
    });
  }

  /**
   * Create a new instance of this item from JSON.
   * @param {object} rawItem The raw JSON object, from disk
   * @returns {FlowerItem}
   */
  static deserialise(rawItem) {
    return InventoryItem.deserialise(
      new FlowerItem(getPlantInfoById(rawItem.id)),
      rawItem,
    );
  }

  /**
   * Get a string constant representation for the type of this item.
   * This is used to determine what type an object was when deserialising from disk.
   * @returns {string}
   */
  static getType() {
    return 'flower-item';
  }
}

module.exports = FlowerItem;
