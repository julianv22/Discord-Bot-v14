const { Client, Collection, Partials } = require('discord.js');
require('dotenv').config();
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
global.chalk = require('chalk');
global.cfg = require('./config.json');
global.prefix = cfg.prefix;

const client = new Client({
  intents: 32767,
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
// Declare Configs
client.snipes = new Collection(); // Snipe Collection

console.log(chalk.bgYellow('\n-----------------Project is running!-----------------\n'));

// Functions Handle
try {
  const table = new ascii().setHeading('Folder', '📝', 'Function Name', '♻').setAlignCenter(1).setBorder('│', '─', '✧', '✧');
  let count = 0;

  const functionFolers = readdirSync('functions');
  functionFolers.forEach(folder => {
    const functionFiles = readdirSync(`functions/${folder}`).filter(f => f.endsWith('.js'));
    table.addRow(`📂 ${folder.toUpperCase()} [${functionFiles.length}]`, '─', '────────────', '📂');

    let i = 1;
    functionFiles.forEach(file => {
      //   delete require.cache[require.resolve[file]];
      require(`./functions/${folder}/${file}`)(client);
      table.addRow('', i++, file.split('.')[0], '✅\u200b');
      count++;
    });
  });
  table.setTitle(`Load Functions [${count}]`);
  console.log(table.toString());
} catch (e) {
  console.error(chalk.red('Error while loading functions'), e);
}
// End Functions Handle

// Commands Handle
client.loadCommands();
// Components Handle
client.loadComponents();
// Events Handle
client.loadEvents();

// Connections
require('mongoose').connect(process.env.mongodb, e => {
  console.error(chalk.green.bold('✅ Connected to mongodb') + chalk.red.bold('\nError:'), e || 0);
});
client.login(process.env.token).catch(e => {
  console.error(e);
});
