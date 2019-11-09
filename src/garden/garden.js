/**
 * The garden itself. It contains things that are growing.
 */
class Garden {

  constructor() {
    this._plants = [];
    this._numActivePlants = 0;
  }

  plantSeed() {

  }

  numActivePlants() {
    return this._numActivePlants;
  }
}

module.exports = new Garden();
