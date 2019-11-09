/**
 * Find some kind of maximum of an array based on an evaluation function
 * 
 * @param {any[]} array Array to iterate over
 * @param {(item: any) => number} func Evaluation function for finding the value of each item for comparison
 */
function findMax(array, func) {
  let max = -Infinity;
  array.forEach((item) => {
    let value = func(item);
    if (value > max) {
      max = value;
    }
  });

  return max;
}

module.exports = findMax;
