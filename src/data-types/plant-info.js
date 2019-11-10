const discovery = require('../discovery');

/**
 * A seed that is in your inventory. It can be planted in the garden
 */
class PlantInfo {
  constructor(definition) {
    this._definition = definition;
  }

  _isDiscovered() {
    return discovery.isSeedDiscovered(this.getId());
  }

  getId() {
    return this._definition.id;
  }

  getSeedName() {
    if (this._isDiscovered()) {
      return this._definition.seed.name;
    } else {
      return `Unidentified seed`
    }
  }

  getStageDescription(stageIndex) {
    return this._definition.stageDescriptions['stage' + stageIndex];
  }

  getSeedSummary() {
    return this._definition.seed.summary;
  }

  getPlantName() {
    if (this._isDiscovered()) {
      return this._definition.plant.name;
    } else {
      return `Unidentified plant`
    }
  }
}

module.exports = PlantInfo;
