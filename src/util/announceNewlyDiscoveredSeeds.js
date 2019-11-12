const { getPlantInfoById } = require('../data-types/seeds');
const terminal = require('../terminal');
const discovery = require('../discovery');

/**
 * Print out a summary of newly discovered plants with an optional message,
 *  clearing out the backlog in the process.
 * @param {string?} message Optional message to display with the summary
 */
function announceNewlyDiscoveredPlants(message, idFilter) {
  // Convert plant ids into PlantInfo objects
  let plantInfos = discovery.getNewlyDiscoveredPlantIds(idFilter).map((id) => getPlantInfoById(id));

  // Only print if there is something to print
  if (plantInfos.length > 0) {
    // Print message if one is supplied
    if (message) {
      terminal.print(terminal.style.message(message));
    }

    // Print summary of discovered plants
    terminal.print('Discovered:');
    plantInfos.forEach((plantInfo) => {
      // @NOTE may need to introduce a new field for Genus or something if `plant.name` is not sufficient
      terminal.print('\t' + plantInfo.getPlantName());
    });
  }
}

module.exports = announceNewlyDiscoveredPlants;
