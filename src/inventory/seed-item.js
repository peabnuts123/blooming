const InventoryItem = require('./inventory-item');

/**
 * A seed that is in your inventory. It can be planted in the garden
 */
class SeedItem extends InventoryItem {
  constructor(definition) {
    super();

    this._definition = definition;
  }

  getId() {
    return this._definition.id;
  }

  getName() {
    return this._definition.seed.name;
  }

  getSummary() {
    return this._definition.seed.summary;
  }
}

module.exports = SeedItem;
