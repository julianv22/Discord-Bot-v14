const alive = require('./alive.js'); // Keep Alive

// require('dotenv').config();
global.chalk = require('chalk');
global.cfg = require('./config/config.json');
global.prefix = cfg.prefix;

const { Client, Collection, Partials } = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
  intents: 65535,
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Commands Collection
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.subCommands = new Collection();
client.slashArray = [];
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.snipes = new Collection();

console.log(chalk.bgYellow('\n-----------------Project is running!-----------------\n'));

// Kiểm tra biến môi trường
if (!process.env.mongodb) {
  console.error(chalk.red.bold('❌ MISSING MONGODB URI!'));
  process.exit(1);
}
if (!process.env.token) {
  console.error(chalk.red.bold('❌ MISSING DISCORD TOKEN!'));
  process.exit(1);
}

// Kết nối MongoDB
mongoose
  .connect(process.env.mongodb)
  .then(() => {
    console.log(chalk.green.bold('✅ Connected to mongodb'));

    require(`./functions/loadFunctions`)(client);
    client.loadFunctions();
    client.loadCommands();
    client.loadComponents();
    client.loadEvents();
    client.login(process.env.token).catch((e) => {
      console.error(chalk.red(e));
    });
  })
  .catch((e) => {
    console.error(chalk.red('Error while connecting to MongoDB!'), e);
    process.exit(1);
  });

// Bắt lỗi toàn cục
process.on('unhandledRejection', (reason, p) => {
  console.error(chalk.red('Unhandled Rejection at:'), p, reason);
});
process.on('uncaughtException', (e) => {
  console.error(chalk.red('Uncaught Exception thrown:'), e);
});
