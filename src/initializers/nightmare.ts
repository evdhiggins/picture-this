import * as Nightmare from "nightmare";

// Add the nightmare-upload module to the Nightmare class
require("nightmare-upload")(Nightmare);

// Initialize
const nightmare: Nightmare = new Nightmare({
  show: process.env.MISC_DISPLAY_WINDOW === "T",
  waitTimeout: 100000
});

export default nightmare;
