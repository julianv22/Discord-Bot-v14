const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');

const gemini = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gemini')
    .setDescription('Chat with Gemini AI (Google GenAI)')
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Your message to Gemini AI').setRequired(true),
    ),
  category: 'info',
  scooldown: 0,
  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const prompt = interaction.options.getString('prompt');
    if (!prompt) {
      return interaction.reply({ content: 'Please provide a prompt to chat with Gemini AI.', ephemeral: true });
    }
    try {
      await interaction.deferReply();
      const res = await gemini.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      let reply = res?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(res);
      if (typeof reply === 'object') reply = JSON.stringify(reply, null, 2);
      await interaction.editReply({ content: reply.length > 2000 ? reply.slice(0, 1997) + '...' : reply });
    } catch (error) {
      console.error('Error communicating with Gemini AI:', error);
      await interaction.editReply({ content: 'There was an error communicating with Gemini AI.' });
    }
  },
};
