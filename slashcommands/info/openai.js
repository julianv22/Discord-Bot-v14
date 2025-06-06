const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('gemini')
    .setDescription('Chat with Gemini AI (Google GenAI)')
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Your message to Gemini AI').setRequired(true),
    ),
  /**
   * Chat with Gemini AI (Google GenAI)
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const chatHistories = new Map();
    const prompt = interaction.options.getString('prompt');
    if (!prompt) {
      return await interaction.reply({ content: 'Please provide a prompt to chat with Gemini AI.', flags: 64 });
    }
    const userId = interaction.user.id;
    let history = chatHistories.get(userId) || [];
    history.push({ role: 'user', text: prompt });
    if (history.length > 10) history = history.slice(history.length - 10);
    try {
      await interaction.deferReply();

      // Import động ESM module
      const mod = await import('@google/genai');
      const GoogleGenAI = mod.GoogleGenAI || mod.default;
      const gemini = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

      const contents = history.map((msg) => msg.text).join('\n');
      const res = await gemini.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
      });
      let reply = res?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(res);
      if (typeof reply === 'object') reply = JSON.stringify(reply, null, 2);
      history.push({ role: 'assistant', text: reply });
      if (history.length > 10) history = history.slice(history.length - 10);
      chatHistories.set(userId, history);

      for (let i = 0; i < reply.length; i += 2000) {
        await interaction.editReply(prompt);
        await interaction.followUp({ content: reply.slice(i, i + 2000) });
      }
    } catch (error) {
      console.error(chalk.red('Error communicating with Gemini AI', error));
      await interaction.editReply({ content: 'There was an error communicating with Gemini AI' });
    }
  },
};
