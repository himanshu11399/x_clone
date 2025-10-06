// // Import the main Arcjet SDK from its module
// import arcjet from "arcjet";            // or `@arcjet/node` or whichever module provides the core client
// import { tokenBucket, shield, detectBot } from "arcjet";  // or from same core package

// // Optionally import inspection utilities
// import { isSpoofedBot } from "@arcjet/inspect";

// import { ENV } from "./env.js";

// export const aj = arcjet({
//   key: ENV.ARCJET_KEY,
//   characteristics: ["ip.src"],
//   rules: [
//     shield({ mode: "LIVE" }),
//     detectBot({
//       mode: "LIVE",
//       allow: ["CATEGORY:SEARCH_ENGINE"],
//     }),
//     tokenBucket({
//       mode: "LIVE",
//       refillRate: 10,
//       interval: 10,
//       capacity: 15,
//     }),
//   ],
// });
