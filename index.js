const { Client, Collection, Partials } = require('discord.js');
const alive = require('./alive.js'); // Keep Alive

// require('dotenv').config();
global.mongoose = require('mongoose');
global.chalk = require('chalk');
global.cfg = require('./config/config.json');
global.prefix = cfg.prefix;

const client = new Client({
  intents: 65535,
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User],
});

// Commands Collection
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.subCommands = new Collection();
client.compColection = new Collection();
client.snipes = new Collection();

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
  .then(async () => {
    console.log(chalk.green.bold('✅ Connected to mongodb'));

    require('./functions/common/utilities'); // Đăng ký function ultilities
    require('./functions/utilities/loadFunctions')(client); // Đăng ký function loadFunctions vào client

    await Promise.all([
      await client.loadFunctions(),
      await client.loadEvents(),
      await client.loadComponents(),
      await client.loadCommands(),
    ]);

    client.login(process.env.token).catch(console.error);
  })
  .catch((e) => {
    console.error(chalk.red('Error while connecting to MongoDB!'), e);
    process.exit(1);
  });

// Bắt lỗi toàn cục
process.on('unhandledRejection', (reason, p) => console.error(chalk.red('Unhandled Rejection at:'), p, reason));
process.on('uncaughtException', (e) => console.error(chalk.red('Uncaught Exception thrown:'), e));
