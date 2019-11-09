const InventoryItem = require('./inventory-item');
const discovery = require('../discovery');

/**
 * A seed that is in your inventory. It can be planted in the garden
 */
class SeedItem extends InventoryItem {
  constructor(definition) {
    super();

    this._definition = definition;
  }

  _isDiscovered() {
    return discovery.isSeedDiscovered(this.getId());
  }

  getId() {
    return this._definition.id;
  }

  getName() {
    if (this._isDiscovered()) {
      return this._definition.seed.name;
    } else {
      return `Unidentified seed`
    }
  }

  getSummary() {
    return this._definition.seed.summary;
  }
}

module.exports = SeedItem;
