const { state, saveState } = require('../state.js');
const GardenItem = require('./garden-item');
const PlantInfo = require('../data-types/plant-info'); // eslint-disable-line no-unused-vars

/**
 * The garden itself. It contains things that are growing.
 */
class Garden {
  constructor() {
    /** @type {number} */
    this._size = 0;
    /** @type {GardenItem[]} */
    this._plants = []
    this._deserialise(state.garden);
  }

  /**
   * @private
   * Find the first garden slot that is empty.
   * If no slots are empty, `undefined` is returned
   * @returns {number|undefined}
   */
  _getFirstEmptySlotIndex() {
    for (let i = 0; i < this._size; i++) {
      if (this._plants[i] === undefined) {
        return i;
      }
    }

    return undefined;
  }

  /**
   * Plant a new seed in the garden
   * @param {PlantInfo} seedInfo Plant info for seed to be planted
   */
  plantSeed(seedInfo) {
    if (this.getNumPlantsGrowing() >= this.getSize()) {
      throw new Error("Can't plant new plant - garden is full");
    }

    let newGardenItem = new GardenItem(seedInfo);
    let slotIndex = this._getFirstEmptySlotIndex();
    this._plants[slotIndex] = newGardenItem;
    this._saveState();
    return slotIndex;
  }

  /**
   * Get the number of plants actively growing in the garden
   * @returns {number}
   */
  getNumPlantsGrowing() {
    let numPlantsGrowing = 0;
    for (let i = 0; i < this.getSize(); i++) {
      if (!this.isSlotEmpty(i)) {
        numPlantsGrowing++;
      }
    }
    return numPlantsGrowing;
  }

  /**
   * Get the garden item growing in a particular slot.
   * If no item is growing in the slot, `undefined` will be returned
   * @param {number} slotIndex Index to get the plant from
   * @returns {GardenItem|undefined}
   */
  getPlantInSlotIndex(slotIndex) {
    return this._plants[slotIndex];
  }

  /**
   * Whether the specified slot is empty i.e. there is no plant currently growing in it
   * @param {number} slotIndex Garden slot index to check
   * @returns {boolean}
   */
  isSlotEmpty(slotIndex) {
    return this.getPlantInSlotIndex(slotIndex) === undefined;
  }

  /**
   * Get the current size of the garden, regardless of how many things are growing.
   * @returns {number}
   */
  getSize() {
    return this._size;
  }

  /**
   * Get all slots in the garden, regardless of whether there is something growing in
   * them or not. Slots that have nothing growing will be `undefined`
   * @returns {(GardenItem|undefined)[]}
   */
  getAllSlots() {
    const numSlots = this.getSize();
    let allSlots = [];
    for (let i = 0; i < numSlots; i++) {
      allSlots.push(this._plants[i]);
    }
    return allSlots;
  }

  /**
   * Get all growing plants in the garden. This is equivalent to getting all slots
   * and then filtering-out empty ones.
   * @returns {GardenItem[]}
   */
  getAllPlants() {
    return this.getAllSlots().filter((slot) => slot !== undefined);
  }

  /**
   * Recalculate and save the stage of all growing plants, if needed
   */
  updatePlantMaturities() {
    let didUpdate = false;
    this.getAllPlants().forEach((gardenItem) => {
      const itemUpdated = gardenItem.updateMaturityStage();
      if (itemUpdated) {
        didUpdate = true;
      }
    });

    if (didUpdate) {
      this._saveState();
    }
  }

  /**
   * @private
   * Save the current state of the garden to disk
   */
  _saveState() {
    state.garden = this._serialise();
    saveState();
  }

  /**
   * @private
   * Convert the current garden state into a JSON object for storing on disk
   * @returns {object}
   */
  _serialise() {
    return {
      size: this._size,
      plants: this._plants.map((gardenItem, slotIndex) => {
        // Plant slots may be empty
        if (gardenItem) {
          let rawGardenItem = gardenItem.serialise();
          rawGardenItem.slotIndex = slotIndex;
          return rawGardenItem;
        } else {
          return undefined;
        }
        // Remove empty slots after slotIndex has been recorded
      }).filter((item) => item !== undefined),
    };
  }

  /**
   * @private
   * Deserialise the garden state from disk (JSON) into proper types
   * @param {object} gardenState Raw garden state object from disk
   */
  _deserialise(gardenState) {
    this._size = gardenState.size;
    this._plants = [];
    gardenState.plants.forEach((rawGardenItem) => {
      // Create plant item from plant ID
      let newGardenItem = GardenItem.deserialise(rawGardenItem);
      // Store item in correct slot index
      this._plants[rawGardenItem.slotIndex] = newGardenItem;
    });
  }
}

module.exports = new Garden();
