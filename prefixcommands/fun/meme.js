const { EmbedBuilder, Message, Client } = require("discord.js");
const got = require("got");

module.exports = {
  name: "meme",
  aliases: [],
  description: "Gửi một meme.",
  category: "fun",
  cooldown: 30,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { guild, channel } = message;
    if (args.join(" ").trim() === "?")
      return client.cmdGuide(message, this.name, this.description);

    //Start
    const Embed = new EmbedBuilder();
    got("https://www.reddit.com/r/memes/random/.json")
      .then((response) => {
        const [list] = JSON.parse(response.body);
        const [post] = list.data.children;
        const permalink = post.data.permalink;
        const memeUrl = `https://reddit.com${permalink}`;
        const memeImage = post.data.url;
        const memeTitle = post.data.title;
        const memeUpvotes = post.data.ups;
        const memeNumComments = post.data.num_comments;

        Embed.setColor("Random");
        Embed.setTitle(`${memeTitle}`);
        Embed.setURL(`${memeUrl}`);
        Embed.setImage(`${memeImage}`);
        Embed.setAuthor({ name: guild.name, iconURL: guild.iconURL(true) });
        Embed.setTimestamp();
        Embed.setFooter({ text: `${memeUpvotes} 👍 | ${memeNumComments} 💬` });
      })
      .catch(console.error);
    channel.send({ embeds: [Embed] }).then(() => message.delete());
    //End
  },
};
