#!/usr/bin/env node

const { version } = process;
const majorVersion = parseInt(version.slice(1).split(".")[0]);

if (majorVersion < 20) {
  console.error(" Error: Node.js version 20 or higher is required");
  console.error(`Current version: ${version}`);
  console.error("Please update Node.js to version 20 or higher");
  process.exit(1);
} else {
  console.log(`Node.js version ${version} is compatible`);
}
