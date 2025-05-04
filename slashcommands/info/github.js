const fetch = require("node-fetch");
const moment = require("moment-timezone");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  Interaction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription(`Github's Information`)
    .addStringOption((opt) =>
      opt.setName("user").setDescription("Github Username").setRequired(true)
    ),
  category: "info",
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const user = interaction.options.getString("user");
    const { user: author } = interaction;

    fetch(`https://api.github.com/users/${user}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.message)
          return interaction.reply({
            embeds: [
              {
                color: 16711680,
                description: `\\❌ | Can not find this user!`,
              },
            ],
            ephemeral: true,
          });
        let {
          login,
          avatar_url,
          name,
          id,
          html_url,
          public_repos,
          followers,
          following,
          location,
          created_at,
          bio,
        } = body;

        const embed = new EmbedBuilder()
          .setAuthor({ name: "Github Information!", iconURL: avatar_url })
          .setColor("Random")
          .setThumbnail(avatar_url)
          .addFields([
            { name: "Username", value: `${login}`, inline: true },
            { name: "ID", value: `${id}`, inline: true },
            { name: "Bio", value: `${bio}`, inline: true },
            {
              name: "Github",
              value: `[${name || login}](${html_url})`,
              inline: true,
            },
            {
              name: "Public Repositories",
              value: `${public_repos || "None"}`,
              inline: true,
            },
            { name: "Followers", value: `${followers}`, inline: true },
            { name: "Following", value: `${following}`, inline: true },
            {
              name: "Location",
              value: `${location || "No Location"}`,
              inline: true,
            },
            {
              name: "Account Created",
              value: moment
                .utc(created_at)
                .tz("Asia/Ho_Chi_Minh")
                .format("HH:mm ddd, Do MMMM YYYY"),
              inline: true,
            },
          ])
          .setFooter({
            text: `Requested by ${author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
  },
};
