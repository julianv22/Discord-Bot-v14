const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('gemini')
    .setDescription('Chat with Gemini AI (Google GenAI)')
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Your message to Gemini AI').setRequired(true)
    ),
  /** - Chat with Gemini AI (Google GenAI)
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user } = interaction;
    const chatHistories = new Map();
    const prompt = interaction.options.getString('prompt');

    if (!prompt) {
      return await interaction.reply({ content: 'Please provide a prompt to chat with Gemini AI.', flags: 64 });
    }

    const history = chatHistories.get(user.id) || [];
    history.push({ role: 'user', text: prompt });

    if (history.length > 10) history = history.slice(history.length - 10);

    await interaction.deferReply();
    // Import động ESM module
    const mod = await import('@google/genai');
    const GoogleGenAI = mod.GoogleGenAI || mod.default;
    const gemini = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const contents = history.map((msg) => msg.text).join('\n');
    const res = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
    });

    let reply = res?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(res);

    if (typeof reply === 'object') reply = JSON.stringify(reply, null, 2);

    history.push({ role: 'assistant', text: reply });

    if (history.length > 10) history = history.slice(history.length - 10);

    chatHistories.set(user.id, history);

    await interaction.editReply(prompt);

    for (let i = 0; i < reply.length; i += 2000) {
      await interaction.followUp({ content: reply.slice(i, i + 2000) });
    }
  },
};
