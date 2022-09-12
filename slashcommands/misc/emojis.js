const { SlashCommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('emojis').setDescription('List Emojis'),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const emojis = guild.emojis.cache.map(e => {
      return { name: `${e}`, value: `\`:${e.name}:\``, inline: true };
    });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: 'Emojis List', iconURL: guild.iconURL(true) })
          .setColor('Random')
          .addFields(emojis.length <= 25 ? emojis : { name: '\u200b', value: guild.emojis.cache.map(e => `${e} \`:${e.name}:\``).join(' | ') })
          .setTimestamp()
          .setFooter({ text: 'Requested by ' + user.username, iconURL: user.displayAvatarURL(true) }),
      ],
    });
  },
};
