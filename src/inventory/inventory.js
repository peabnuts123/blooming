/**
 * The player's inventory; what items they have.
 */
class Inventory {
  constructor() {
    this._items = [];
  }

  add(item) {
    this._items.push(item);
  }

  remove(item) {
    const itemIndex = this._items.indexOf(item);
    this._items.splice(itemIndex, 1);
  }
}

module.exports = new Inventory();
