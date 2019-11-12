# Blooming

A game about growing and selling flowers. This document is a work-in-progress.

## Rough architecture (v1)

The game is a CLI installable through npm. The input is through prompts like a terminal. There are commands you can type, including "help" to see what commands are currently available. I guess the commands you can do might be contextual? You receive a small random amount of seeds every time you open the game but at most only ever once per hour or two. You can plant the seeds and watch them grow. I think watering the seeds might be too stressful they should just grow over time. You can check on your seeds. The game outputs a description of the seeds that you have planted in your garden e.g. "There is a small green shoot showing through the soil" or "It's a large blooming bush of flowers with round yellow flowers". Planted plants have well-known stages of growth. Eventually a planted plant will go to seed and turn into an amount of seeds that need to be collected. Once collected the seeds of a particular plant are well-known and will show in the inventory as seeds for that particular plant (rather than anonymous seeds). Alternatively. One may harvest a growing plant for its flowers which also go into the player's inventory but the plant will then not produce any seeds. Players can also view orders for flowers that they can fulfil from their inventory in exchange for money. Players can then buy seeds from the store using their money. The store has many well-known seeds as well as exotic and unidentified seeds. The stock of the store changes over time.

## Design backlog
 * ✅ ~~Receive seeds for logging in (max once per X minutes)~~
 * ✅ ~~List inventory~~
 * ✅ ~~Inspect items in your inventory~~
 * ✅ ~~Show garden~~
 * ✅ ~~Plant seed from inventory into garden~~
 * ✅ ~~Discover a plant once it reaches maturity~~
 * ✅ ~~Harvest / Collect seeds from garden~~
 * ✅ ~~Harvest / Collect flowers from garden~~
 * ✅ ~~Time until next growing phase in Garden summary~~
 * ✅ ~~Toggle light/dark theme~~
 * ✅ ~~=== MVP LINE 🏆 ===~~
 * Inspect plant in garden
 * Harvest all command
 * View orders
 * Receive new orders every X minutes
 * Fulfil order from inventory
 * View store
 * Inspect items in store
 * Buy item from store
 * Change items in the store every X minutes

## Technical backlog
 * Document and tidy up files
      * discovery
      * plant-info
 * ✅ ~~Text colouring and styles~~
 * Add more plants
 * ✅ ~~"Gone to seed" message~~
 * "Harvest all" command
 * Straighten out column sizes
 * === MVP LINE 🏆 ===
 * Growth stage time durations
 * autocomplete more than just the command alias
