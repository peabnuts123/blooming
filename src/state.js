const path = require('path');
const fs = require('fs');

const packageJson = require('../package.json');


const DATA_FILE_NAME = 'state.json';

// Get root folder for this application's data
const appDataRoot = path.join(getOSAppDataRoot(), packageJson.name);
// Ensure this folder exists
fs.mkdirSync(appDataRoot, { recursive: true });

const dataFileFullPath = path.join(appDataRoot, DATA_FILE_NAME);

let dataFileExists = fs.existsSync(dataFileFullPath);
let state;
if (dataFileExists) {
  // State file exists, try to read it
  const stateFileContents = fs.readFileSync(dataFileFullPath, { encoding: 'utf8' });

  try {
    // Attempt to parse file contents as JSON
    state = JSON.parse(stateFileContents);
  } catch (e) {
    throw new Error(`Could not load application state (not valid JSON). Please check the file is not corrupted: ${dataFileFullPath}`);
  }
} else {
  // State file does not exist, make a new one
  state = createNewState();
  // console.log('[DEBUG] Created NEW state');
  saveState();
}


/**
 * Get the root location for storing application data for the current OS
 */
function getOSAppDataRoot() {
  return process.env.APPDATA ||
    (
      process.platform == 'darwin' ?
        process.env.HOME + '/Library/Application Support' :
        process.env.HOME + "/.local/share"
    );
}

/**
 * Create a new state object with all the properties are needed for the application to run properly
 */
function createNewState() {
  return {
    /** Version of this state, for migrating */
    version: 1,
    /** Player's inventory */
    inventory: {
      items: [],
    },
    /** The garden */
    garden: {
      size: 5,
      plants: [],
    },
    discovery: {
      /** List of IDs of seeds that are well-known to the player */
      seedIds: [],
      /** List of IDs of plants that have been discovered but have not yet been announced (subset of `seedIds`) */
      newlyDiscoveredIds: [],
    },
    terminal: {
      /** Current display theme e.g. light/dark */
      theme: 0,
    },
    /** Time of last login */
    lastLoginTime: undefined,
    /** Time of last login reward */
    lastLoginRewardTime: undefined,
  };
}

/**
 * Persist the current state to disk
 */
function saveState() {
  const stateFileContents = JSON.stringify(state);
  fs.writeFileSync(dataFileFullPath, stateFileContents);
  // console.log('[DEBUG] Wrote state to disk');
}

module.exports = {
  state,
  saveState,
};
