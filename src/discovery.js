const { state, saveState } = require('./state');

class Discovery {
  constructor() {
    this._deserialise(state.discovery);
  }

  isSeedDiscovered(seedId) {
    this._discoveredSeedIds.includes(seedId);
  }

  _deserialise(discoveryState) {
    this._discoveredSeedIds = discoveryState.seedIds;
  }

  _saveState() {
    state.discovery = this._serialise;
    saveState();
  }
  
  _serialise() {
    return {
      seedIds: this._discoveredSeedIds,
    };
  }
}

module.exports = new Discovery();