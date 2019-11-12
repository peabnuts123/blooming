const { state, saveState } = require('./state');

/**
 * Object that tracks what things have been discovered/identified by the player
 */
class Discovery {
  constructor() {
    /** @type {string[]} */
    this._discoveredSeedIds = [];
    /** @type {string[]} */
    this._newlyDiscoveredIds = [];

    this._deserialise(state.discovery);
  }

  /**
   * Whether a plant has been discovered yet
   * @param {string} plantId Unique plant identifier
   * @returns {boolean}
   */
  isPlantDiscovered(plantId) {
    return this._discoveredSeedIds.includes(plantId);
  }

  /**
   * Mark a plant as discovered.
   * Discovered plants are queued up in a separate "Newly discovered" category
   * until cleared out by `getNewlyDiscoveredPlantIds()`
   * @param {string} plantId Unique plant identifier
   */
  markPlantAsDiscovered(plantId) {
    // Ensure we never add a double-up
    if (!this.isPlantDiscovered(plantId)) {
      this._discoveredSeedIds.push(plantId);

      // Add to backlog of newly discovered seeds
      this._newlyDiscoveredIds.push(plantId);

      // Save state
      this._saveState();
    }
  }

  /**
   * Retrieve a list of plant ids that have been newly discovered, clearing those IDs
   *  from the "newly discovered" list in the process.
   * Optionally, pass in a filter to limit returned IDs only to a certain whitelist
   * @param {string[]?} idFilter Optional array of id strings to filter by
   * @returns {string[]}
   */
  getNewlyDiscoveredPlantIds(idFilter) {
    if (idFilter === undefined) {
      // `idFilter` defaults to everything i.e. if you pass no filter, everything is returned
      idFilter = this._newlyDiscoveredIds;
    }
    // Fetch ids that are in current collection
    let plantIds = this._newlyDiscoveredIds.filter((id) => idFilter.includes(id));

    // Empty out collection and save state
    this._newlyDiscoveredIds = this._newlyDiscoveredIds.filter((id) => !idFilter.includes(id));
    this._saveState();

    return plantIds;
  }


  /**
   * @private
   * Deserialise the discovery state from disk (JSON)
   * @param {object} discoveryState Raw discovery state object from disk
   */
  _deserialise(discoveryState) {
    this._discoveredSeedIds = discoveryState.seedIds;
    this._newlyDiscoveredIds = discoveryState.newlyDiscoveredIds;
  }

  /**
   * @private
   * Save the current discovery state to disk
   */
  _saveState() {
    state.discovery = this._serialise();
    saveState();
  }

  /**
   * @private
   * Convert the current discovery state into a JSON object for storing on disk
   * @returns {object}
   */
  _serialise() {
    return {
      seedIds: this._discoveredSeedIds,
      newlyDiscoveredIds: this._newlyDiscoveredIds,
    };
  }
}

module.exports = new Discovery();
