const constants = require('../constants');
const { getPlantInfoById } = require('../data-types/seeds');
const PlantInfo = require('../data-types/plant-info'); // eslint-disable-line no-unused-vars
const discovery = require('../discovery');

/**
 * A garden item i.e. a plant that is currently growing in the Garden
 */
class GardenItem {
  /**
   * @param {PlantInfo} plantInfo
   */
  constructor(plantInfo) {
    /** @type {PlantInfo} */
    this.plant = plantInfo;
    /** @type {number} */
    this.stage = 0;
    /** @type {Date} */
    this.lastMaturityTime = new Date();
  }

  /**
   * Get the plant ID of this garden item
   * @returns {string}
   */
  getPlantId() {
    return this.plant.getId();
  }

  /**
   * Name of this plant
   * @returns {string}
   */
  getName() {
    return this.plant.getPlantName();
  }

  /**
   * Description of how this plant is growing
   * @returns {string}
   */
  getStageSummary() {
    return this.plant.getStageDescription(this.stage);
  }

  /**
   * Recalculate the stage of a growing plant, if needed
   */
  updateMaturityStage() {
    const originalStage = this.stage;
    let secondsSinceLastMaturity = (new Date() - this.lastMaturityTime) / 1000;
    let stagesToMature = Math.floor(secondsSinceLastMaturity / constants.GARDEN_PLANT_STAGE_DURATION_SECONDS);

    for (let i = 0; i < stagesToMature; i++) {
      if (this.stage >= constants.NUM_PLANT_STAGES) {
        // Stop iterating if plant has reached max stages
        break;
      }

      this.stage++;
      // If plant has reached maturity, mark as discovered
      if (this.stage == constants.PLANT_MATURITY_STAGE && !this.plant.isDiscovered()) {
        discovery.markSeedAsDiscovered(this.plant.getId());
      }
    }
    let didMature = this.stage > originalStage;

    if (didMature) {
      this.lastMaturityTime = new Date();
    }

    // Signal whether the plant matured / updated (to signal whether the app should save)
    return didMature;
  }

  /**
   * Whether this plant has gone to seed i.e. it has reached the max stage
   * @returns {boolean}
   */
  hasGoneToSeed() {
    return this.stage >= constants.NUM_PLANT_STAGES;
  }

  /**
   * Generate a harvest payload for this garden item, based on the current stage it is in.
   * This will return a random number of seeds and flowers, based on the underlying PlantInfo's
   * harvest definitions.
   */
  generateHarvestPayload() {
    const harvestRanges = this.plant.getStageHarvestRanges(this.stage);
    const numSeeds = Math.floor(Math.random() * (harvestRanges.seedMax - harvestRanges.seedMin + 1)) + harvestRanges.seedMin;
    const numFlowers = Math.floor(Math.random() * (harvestRanges.flowerMax - harvestRanges.flowerMin + 1)) + harvestRanges.flowerMin;

    return {
      /** @type {number} */
      numSeeds,
      /** @type {number} */
      numFlowers,
      /** @type {PlantInfo} */
      plantInfo: this.plant,
    };
  }

  /**
   * Convert this item into a JSON representation for saving to disk
   * @returns {object}
   */
  serialise() {
    return {
      id: this.plant.getId(),
      // slotIndex,
      stage: this.stage,
      lastMaturityTime: this.lastMaturityTime.toISOString(),
    }
  }

  /**
   * Create a new instance of this item from JSON.
   * @param {object} rawItem The raw JSON object, from disk
   * @returns {GardenItem}
   */
  static deserialise(rawItem) {
    let newGardenItem = new GardenItem(getPlantInfoById(rawItem.id));
    newGardenItem.stage = rawItem.stage;
    newGardenItem.lastMaturityTime = new Date(rawItem.lastMaturityTime);
    return newGardenItem;
  }
}

module.exports = GardenItem;