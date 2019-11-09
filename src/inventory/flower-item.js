const InventoryItem = require('./inventory-item');

/**
 * A flower harvested from the garden that is in your inventory.
 * @TODO type base e.g. from JSON blobs
 */
class FlowerItem extends InventoryItem {
  constructor() {
    super();
  }

  getName() {
    return "Flower (TODO)";
  }

  getSummary() {
    return "It's a flower of an unimplemented variety.";
  }
}

module.exports = FlowerItem;
