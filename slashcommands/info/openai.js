const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');

const gemini = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
// Lưu lịch sử chat tạm thời theo userId
const chatHistories = new Map();

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
    const userId = interaction.user.id;
    // Lấy lịch sử chat của user (tối đa 10 tin nhắn gần nhất)
    let history = chatHistories.get(userId) || [];
    // Thêm prompt mới vào lịch sử
    history.push({ role: 'user', text: prompt });
    // Giữ tối đa 10 tin nhắn gần nhất
    if (history.length > 10) history = history.slice(history.length - 10);
    try {
      await interaction.deferReply();
      // Tạo nội dung gửi cho Gemini: nối các tin nhắn trước đó
      const contents = history.map((msg) => msg.text).join('\n');
      const res = await gemini.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
      });
      let reply = res?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(res);
      if (typeof reply === 'object') reply = JSON.stringify(reply, null, 2);
      // Lưu phản hồi của AI vào lịch sử
      history.push({ role: 'assistant', text: reply });
      if (history.length > 10) history = history.slice(history.length - 10);
      chatHistories.set(userId, history);
      for (let i = 0; i < reply.length; i += 2000) {
        await interaction.followUp({ content: reply.slice(i, i + 2000) });
      }
    } catch (error) {
      console.error(chalk.red.bold('Error communicating with Gemini AI:', error));
      await interaction.editReply({ content: 'There was an error communicating with Gemini AI.' });
    }
  },
};
