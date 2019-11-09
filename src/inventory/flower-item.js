const InventoryItem = require('./inventory-item');

/**
 * A flower harvested from the garden that is in your inventory.
 */
class FlowerItem extends InventoryItem {
  constructor() {
    super();
  }
}

module.exports = FlowerItem;
