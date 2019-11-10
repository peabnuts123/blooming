const { state, saveState } = require('../state.js');
const { getPlantInfoById } = require('../data-types/seeds');
const constants = require('../constants');

/**
 * The garden itself. It contains things that are growing.
 */
class Garden {
  constructor() {
    this._deserialise(state.garden);
  }

  _createNewPlantEntry(plant) {
    return new GardenItem(plant);
  }

  _getFirstEmptySlotIndex() {
    for (let i = 0; i < this._size; i++) {
      if (this._plants[i] === undefined) {
        return i;
      }
    }

    return undefined;
  }

  plantSeed(seedInfo) {
    if (this.getNumPlantsGrowing() >= this._size) {
      throw new Error("Can't plant new plant - garden is full");
    }

    let newPlantEntry = this._createNewPlantEntry(seedInfo);
    let slotIndex = this._getFirstEmptySlotIndex();
    this._plants[slotIndex] = newPlantEntry;
    this._saveState();
    return slotIndex;
  }

  getNumPlantsGrowing() {
    return this._plants.length;
  }

  getPlantInSlotIndex(slotIndex) {
    return this._plants[slotIndex];
  }

  isSlotEmpty(slotIndex) {
    return this.getPlantInSlotIndex(slotIndex) === undefined;
  }

  getSize() {
    return this._size;
  }

  getAllSlots() {
    const numSlots = this.getSize();
    let allSlots = [];
    for (let i = 0; i < numSlots; i++) {
      allSlots.push(this._plants[i]);
    }
    return allSlots;
  }

  getAllPlants() {
    return this.getAllSlots().filter((slot) => slot !== undefined);
  }

  updatePlantMaturities() {
    let didUpdate = false;
    this.getAllPlants().forEach((gardenEntry) => {
      const entryUpdated = gardenEntry.updateMaturityStage();
      if (entryUpdated) {
        didUpdate = true;
      }
    });

    if (didUpdate) {
      this._saveState();
    }
  }

  _deserialise(gardenState) {
    this._size = gardenState.size;
    this._plants = []
    gardenState.plants.forEach((plantStateItem) => {
      /* 
        plantStateItem: {
          id: 'daffodil',
          // @TODO better than this?
          stage: 2,
          lastMaturityTime: '2019-11-09T20:01:03.292Z',
        }
       */
      // Create plant entry from plant ID
      let newPlantEntry = this._createNewPlantEntry(getPlantInfoById(plantStateItem.id));
      newPlantEntry.stage = plantStateItem.stage;
      newPlantEntry.lastMaturityTime = new Date(plantStateItem.lastMaturityTime);

      // Store entry in correct slot index
      this._plants[plantStateItem.slotIndex] = newPlantEntry;
    });
  }

  _saveState() {
    state.garden = this._serialise();
    saveState();
  }

  _serialise() {
    return {
      size: this._size,
      plants: this._plants.map((plantEntry, slotIndex) => {
        // Plant slots may be empty
        if (plantEntry) {
          return {
            id: plantEntry.plant.getId(),
            slotIndex,
            stage: plantEntry.stage,
            lastMaturityTime: plantEntry.lastMaturityTime.toISOString(),
          };
        } else {
          return undefined;
        }
        // Remove empty slots after slotIndex has been recorded
      }).filter((item) => item !== undefined),
    };
  }
}

// @TODO rename? GardenEntry? PlantEntry? PlantInfo?
class GardenItem {
  constructor(plantInfo) {
    this.plant = plantInfo;
    this.stage = 0;
    this.lastMaturityTime = new Date();
  }

  getName() {
    return this.plant.getPlantName();
  }

  getStageSummary() {
    return this.plant.getStageDescription(this.stage);
  }

  updateMaturityStage() {
    let secondsSinceLastMaturity = (new Date() - this.lastMaturityTime) / 1000;
    // @TODO move into seed data
    const debug_SECONDS_PER_STAGE = 10;
    let stagesToMature = Math.floor(secondsSinceLastMaturity / debug_SECONDS_PER_STAGE);

    let didMature = stagesToMature > 0;
    for (let i = 0; i < stagesToMature; i++) {
      this.stage++;

      if (this.stage === constants.NUM_PLANT_STAGES) {
        // Stop iterating if plant has reached max stages
        break;
      }
    }

    if (didMature) {
      this.lastMaturityTime = new Date();
    }

    // Signal whether the plant updated
    return didMature;
  }

  /**
   * Whether this plant has gone to seed i.e. it has reached the max stage
   */
  hasGoneToSeed() {
    return this.stage >= constants.NUM_PLANT_STAGES;
  }
}


module.exports = new Garden();
