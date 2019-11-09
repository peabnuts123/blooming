const { state, saveState } = require('./state');

class Discovery {
  constructor() {
    this._deserialise(state.discovery);
  }

  isSeedDiscovered(seedId) {
    return this._discoveredSeedIds.includes(seedId);
  }

  markSeedAsDiscovered(seedId) {
    // Ensure we never add a double-up
    if (!this.isSeedDiscovered(seedId)) {
      this._discoveredSeedIds.push(seedId);
      this._saveState();
    }
  }

  _deserialise(discoveryState) {
    this._discoveredSeedIds = discoveryState.seedIds;
  }

  _saveState() {
    state.discovery = this._serialise();
    saveState();
  }

  _serialise() {
    return {
      seedIds: this._discoveredSeedIds,
    };
  }
}

module.exports = new Discovery();