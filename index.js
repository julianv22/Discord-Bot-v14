const alive = require("./alive.js"); // Keep Alive

// require('dotenv').config();
global.chalk = require("chalk");
global.cfg = require("./config/config.json");
global.prefix = cfg.prefix;

const { Client, Collection, Partials } = require("discord.js");
const client = new Client({
  intents: 65535,
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Commands Collection
client.prefixCommands = new Collection(); // Prefix Commands
client.slashCommands = new Collection(); // Slash Commands
client.subCommands = new Collection(); // Sub Commands
client.slashArray = [];
// Components Declare
client.buttons = new Collection(); // Buttons Collection
client.menus = new Collection(); // Menus Collection
client.modals = new Collection(); // Modals Collection
// Others
client.snipes = new Collection(); // Snipe Collection

console.log(
  chalk.bgYellow("\n-----------------Project is running!-----------------\n")
);

// Functions Handle
require(`./functions/loadFunctions`)(client);
client.loadFunctions();
// Commands Handle
client.loadCommands();
// Components Handle
client.loadComponents();
// Events Handle
client.loadEvents();

// Connections
require("mongoose")
  .connect(process.env.mongodb)
  .then(
    () => {
      console.log(chalk.green.bold("✅ Connected to mongodb"));
    },
    (err) => {
      console.error(chalk.red.bold("Error!"), err);
    }
  );

client.login(process.env.token).catch((e) => {
  console.error(e);
});
