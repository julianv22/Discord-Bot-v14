const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('Provides information and commands related to the economy system.')
    .addSubcommand((sub) => sub.setName('guide').setDescription('Displays a guide to the economy system.')),
  /** - Provides information and commands related to the economy system.
   * @param {Interaction} interaction - The command interaction.
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { guild, user } = interaction;

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.coin_gif)
        .setAuthor({ name: guild.name, iconURL: cfg.money_wings_gif })
        .setTitle('Economy System - User Guide')
        .setDescription(
          `Hello **${
            user.displayName || user.username
          }**!\nHere are the main functions of the economy system on this server:`
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp()
        .setFields(
          { name: '/daily', value: '-# Receive free \\💲 daily. You can claim again after 0h.', inline: true },
          { name: '/balance', value: '-# View balance, streak, bank, inventory, achievements.', inline: true },
          { name: '/job', value: '-# Get a random job, work and earn \\💲 (with cooldown).', inline: true },
          { name: '/rob', value: '-# Rob \\💲 from other users (with risk and cooldown).', inline: true },
          { name: '/leaderboard', value: '-# View the leaderboard of the top \\🔟 richest users.', inline: true },
          { name: '/shop', value: '-# Purchase items with \\💲.\n-# (Under construction)', inline: true },
          { name: '/inventory', value: '-# View your item inventory.\n-# (Under construction)', inline: true },
          { name: '/bank', value: '-# Deposit/withdraw \\💲 from the bank.', inline: true },
          { name: '/transfer', value: '-# Transfer \\💲 to other users.', inline: true }
        ),
    ];

    return await interaction.editReply({ embeds });
  },
};
