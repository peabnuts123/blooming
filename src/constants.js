const constants = {
  /**
   * The minimum time required between receiving reward seeds for logging in
   */
  // SEED_REWARD_MIN_INTERVAL_SECONDS: 3600,
  SEED_REWARD_MIN_INTERVAL_SECONDS: 10,

  /**
   * For plants growing in the garden, how many maturity stages are there before the plant goes to seed
   */
  NUM_PLANT_STAGES: 5,

  /** Stage index at which a plant is deemed "mature" */
  PLANT_MATURITY_STAGE: 3,
  /** Stage index at which a plant is deemed "gone to seed" */
  PLANT_SEED_STAGE: 4,
};

module.exports = constants;
