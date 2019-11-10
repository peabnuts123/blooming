const InventoryItem = require('./inventory-item');

class FlowerItem extends InventoryItem {
  constructor() {
    super();

    // @TODO what will the param here be? PlantInfo also?
    //  PlantInfo specifies the name of a output of a plant? Probably.
  }
}

module.exports = FlowerItem;