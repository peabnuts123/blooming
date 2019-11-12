const discovery = require('../discovery');
const constants = require('../constants');
const terminal = require('../terminal');

/**
 * An object containing all the information about a plant in all of its forms.
 */
class PlantInfo {
  constructor(definition) {
    this._definition = definition;
  }

  /**
   * Whether this plant has been discovered yet
   * @returns {boolean}
   */
  isDiscovered() {
    return discovery.isPlantDiscovered(this.getId());
  }

  /**
   * Get the unique identifier for this plant
   * @returns {string}
   */
  getId() {
    return this._definition.id;
  }

  /**
   * Get the display name of this plant as a seed.
   * If it hasn't been discovered yet, it will just have a generic, "unidentified" name
   * @returns {string}
   */
  getSeedName() {
    if (this.isDiscovered()) {
      return terminal.style.inventory.seedItem(this._definition.seed.name);
    } else {
      return terminal.style.inventory.unidentifiedItem(`Unidentified seed`);
    }
  }

  /**
   * Get the display summary of this plant as a seed.
   * @returns {string}
   */
  getSeedSummary() {
    return this._definition.seed.summary;
  }

  /**
   * Get the display name of this plant as a in the garden.
   * If it hasn't been discovered yet, it will just have a generic, "unidentified" name
   * @returns {string}
   */
  getPlantName() {
    if (this.isDiscovered()) {
      return terminal.style.garden.plantName(this._definition.plant.name);
    } else {
      return terminal.style.garden.unidentifiedPlant(`Unidentified plant`);
    }
  }

  /**
   * Get the description of how this plant is growing for a specific stage.
   * @param {number} stageIndex The stage for which to get a description
   * @returns {string}
   */
  getStageDescription(stageIndex) {
    return this._definition.stageDescriptions['stage' + stageIndex];
  }

  /**
   * Get the display name of this plant as a flower
   * @returns {string}
   */
  getFlowerName() {
    return terminal.style.inventory.flowerItem(this._definition.flower.name);
  }

  /**
   * Get the summary of this plant as a flower
   * @returns {string}
   */
  getFlowerSummary() {
    return this._definition.flower.summary;
  }

  /**
   * Get the harvest resource drop ranges for this plant at a given stage.
   * @param {number} stageIndex The stage for which to get harvest resource drop ranges
   * @returns {object} An object containing ranges e.g. "seedMin", "seedMax", "flowerMin" and "flowerMax"
   */
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
