const { state, saveState } = require('./state');

class Discovery {
  constructor() {
    this._deserialise(state.discovery);
  }

  isSeedDiscovered(plantId) {
    return this._discoveredSeedIds.includes(plantId);
  }

  markSeedAsDiscovered(plantId) {
    // Ensure we never add a double-up
    if (!this.isSeedDiscovered(plantId)) {
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


  _deserialise(discoveryState) {
    this._discoveredSeedIds = discoveryState.seedIds;
    this._newlyDiscoveredIds = discoveryState.newlyDiscoveredIds;
  }

  _saveState() {
    state.discovery = this._serialise();
    saveState();
  }

  _serialise() {
    return {
      seedIds: this._discoveredSeedIds,
      newlyDiscoveredIds: this._newlyDiscoveredIds,
    };
  }
}

module.exports = new Discovery();
