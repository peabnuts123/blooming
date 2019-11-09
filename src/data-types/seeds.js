const SeedItem = require('../inventory/seed-item');

/**
 * Base seed object. All seed objects will inherit these values by default
 */
const base = {
  id: 'NOT IMPLEMENTED',
  seed: {
    name: "NOT IMPLEMENTED",
    summary: "NOT IMPLEMENTED",
  },
  plant: {
    name: "NOT IMPLEMENTED",
  },
  stageDescriptions: {
    stage0: "Two small leaves can be seen protruding from the ground.",
    stage1: "It's a small plant with healthy looking leaves.",
    stage2: "It has nice, healthy buds on it. It's going to flower soon!",
    stage3: "It's in full bloom! Beautiful flowers beaming in the sun!",
    stage4: "It's looking withered and peaceful, it will go to seed soon.",
  },
};

/**
 * Raw data for seeds
 */
const seeds = [
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
    stageDescriptions: {
      stage1: "Small shoots have emerged with healthy looking leaves.",
      stage2: "The tips are looking plump and ready to bloom. It's going to flower soon!",
      stage3: "It's in full bloom! A beautiful yellow flower sits atop the plant.",
    },
  },
];


// Compile seeds into classes for computation
const ALL_SEEDS = seeds.map((seedDefinition) => {
  // Combine seed definition with base
  let compiledDefinition = Object.assign({}, base, seedDefinition, {
    // Combine nested properties with base property
    seed: Object.assign({}, base.seed, seedDefinition.seed),
    plant: Object.assign({}, base.plant, seedDefinition.plant),
    stageDescriptions: Object.assign({}, base.stageDescriptions, seedDefinition.stageDescriptions),
  });

  // Construct class object from compiled blueprint
  return new SeedItem(compiledDefinition);
});

/**
 * Look up a seed data item by ID
 * @param {string} id ID of seed data item
 */
function getSeedItemById(id) {
  return ALL_SEEDS.find((seedItem) => seedItem.getId() === id);
}

module.exports = {
  ALL_SEEDS,
  getSeedItemById,
};
