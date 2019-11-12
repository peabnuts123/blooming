const PlantInfo = require('./plant-info');

/**
 * Base plant definition object. All plant definitions will inherit these values by default
 */
const base = {
  /** Unique identifier for plant */
  id: 'NOT IMPLEMENTED',
  /** Data for when the plant is a seed in the inventory */
  seed: {
    /** Display name of the seed item */
    name: "NOT IMPLEMENTED",
    /** Display summary of the seed item */
    summary: "NOT IMPLEMENTED",
  },
  /** Data for when the plant is planted in the garden */
  plant: {
    /** Display name of the plant */
    name: "NOT IMPLEMENTED",
  },
  /** Data for when the plant is a flower in the inventory */
  flower: {
    /** Display name of the flower item */
    name: "NOT IMPLEMENTED",
    /** Display summary of the flower item */
    summary: "NOT IMPLEMENTED",
  },
  /** Data for what drops when the plant is harvested from the garden */
  harvest: {
    /** Drop data for when the plant has not yet matured */
    plant: {
      seedMin: 1, seedMax: 1,
      flowerMin: 0, flowerMax: 0,
    },
    /** Drop data for when the plant has matured but has not yet gone to seed */
    flower: {
      seedMin: 1, seedMax: 1,
      flowerMin: 1, flowerMax: 1,
    },
    /** Drop data for when the plant has gone to seed */
    seed: {
      seedMin: 1, seedMax: 1,
      flowerMin: 0, flowerMax: 0,
    },
  },
  /** Description text for the different stages of a plant's lifecycle */
  stageDescriptions: {
    stage0: "Two small leaves can be seen protruding from the ground.",
    stage1: "It's a small plant with healthy looking leaves.",
    stage2: "It has nice, healthy buds on it. It's going to flower soon!",
    stage3: "It's in full bloom! Beautiful flowers beaming in the sun!",
    stage4: "It's looking withered and peaceful, it will go to seed soon.",
  },
};

/**
 * Raw plant definition
 */
const rawPlantDefinitions = [
  // ------------------
  // POPPY
  // ------------------
  {
    id: 'poppy',
    seed: {
      name: "Seed (Poppy)",
      summary: "A tiny, round, black seed.",
    },
    plant: {
      name: "Poppy",
    },
    flower: {
      name: "Flower (Poppy)",
      summary: "A cup-shaped, brilliant red flower with a dark center.",
    },
    harvest: {
      flower: {
        seedMin: 1, seedMax: 2,
        flowerMin: 1, flowerMax: 4,
      },
      seed: {
        seedMin: 3, seedMax: 6,
      },
    },
    stageDescriptions: {
      stage2: "A brilliant red flower is emerging, it's starting to open up!",
      stage3: "It's in full bloom! A bright crimson flower with delicate petals, a dark pod of seeds in the center.",
      stage4: "The flower is all but gone, leaving a pepper-shaker-like pod of seeds behind. It will soon dry out, ready for replanting.",
    },
  },
  // ------------------
  // DAFFODIL
  // ------------------
  {
    id: 'daffodil',
    seed: {
      name: "Bulb (Daffodil)",
      summary: "A medium-sized bulb, it looks a bit like an onion.",
    },
    plant: {
      name: "Daffodil",
    },
    flower: {
      name: "Flower (Daffodil)",
      summary: "A bright yellow flower. A star of petals surround a steep teacup in the center.",
    },
    stageDescriptions: {
      stage1: "Small shoots have emerged with healthy looking leaves.",
      stage2: "The tips are looking plump and ready to bloom. It's going to flower soon!",
      stage3: "It's in full bloom! A beautiful yellow flower sits atop the plant.",
    },
  },
];


// Compile seeds into classes for computation
const ALL_PLANT_INFOS = rawPlantDefinitions.map((plantDefinition) => {
  // Combine seed definition with base
  let compiledDefinition = Object.assign({}, base, plantDefinition, {
    // Combine nested properties with base property
    seed: Object.assign({}, base.seed, plantDefinition.seed),
    plant: Object.assign({}, base.plant, plantDefinition.plant),
    flower: Object.assign({}, base.flower, plantDefinition.flower),
    harvest: Object.assign({}, base.harvest),
    stageDescriptions: Object.assign({}, base.stageDescriptions, plantDefinition.stageDescriptions),
  });

  // Merge harvest definitions if supplied
  if (plantDefinition.harvest) {
    // Merge each option individually
    compiledDefinition.harvest.plant = Object.assign({}, compiledDefinition.harvest.plant, plantDefinition.harvest.plant);
    compiledDefinition.harvest.flower = Object.assign({}, compiledDefinition.harvest.flower, plantDefinition.harvest.flower);
    compiledDefinition.harvest.seed = Object.assign({}, compiledDefinition.harvest.seed, plantDefinition.harvest.seed);
  }

  // Construct class object from compiled blueprint
  return new PlantInfo(compiledDefinition);
});

/**
 * Look up a plant info item by ID
 * @param {string} id ID of plant info item
 */
function getPlantInfoById(id) {
  return ALL_PLANT_INFOS.find((plantInfo) => plantInfo.getId() === id);
}

/**
 * Get a random plant from the collection of all plant definitions
 */
function getRandomPlantInfo() {
  return ALL_PLANT_INFOS[Math.floor(Math.random() * ALL_PLANT_INFOS.length)];
}

module.exports = {
  getPlantInfoById,
  getRandomPlantInfo,
};
