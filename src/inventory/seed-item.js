const InventoryItem = require('./inventory-item');

/**
 * A seed that is in your inventory. It can be planted in the garden
 */
class SeedItem extends InventoryItem {
  constructor() {
    super();
  }
}

module.exports = SeedItem;
