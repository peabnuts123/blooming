const discovery = require('../discovery');
const constants = require('../constants');

/**
 * A seed that is in your inventory. It can be planted in the garden
 */
class PlantInfo {
  constructor(definition) {
    this._definition = definition;
  }

  isDiscovered() {
    return discovery.isSeedDiscovered(this.getId());
  }

  getId() {
    return this._definition.id;
  }

  getSeedName() {
    if (this.isDiscovered()) {
      return this._definition.seed.name;
    } else {
      return `Unidentified seed`
    }
  }

  getSeedSummary() {
    return this._definition.seed.summary;
  }

  getPlantName() {
    if (this.isDiscovered()) {
      return this._definition.plant.name;
    } else {
      return `Unidentified plant`
    }
  }

  getStageDescription(stageIndex) {
    return this._definition.stageDescriptions['stage' + stageIndex];
  }

  /**
   * Get the display name of this plant as a flower
   * @returns {string}
   */
  getFlowerName() {
    return this._definition.flower.name;
  }

  /**
   * Get the summary of this plant as a flower
   * @returns {string}
   */
  getFlowerSummary() {
    return this._definition.flower.summary;
  }

  getStageHarvestRanges(stageIndex) {
    if (stageIndex >= constants.PLANT_SEED_STAGE) {
      return this._definition.harvest.seed;
    } else if (stageIndex >= constants.PLANT_MATURITY_STAGE) {
      return this._definition.harvest.flower;
    } else {
      return this._definition.harvest.plant;
    }
  }
}

module.exports = PlantInfo;
