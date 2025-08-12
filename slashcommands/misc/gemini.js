const { Client, Interaction, SlashCommandBuilder } = require('discord.js');
const { embedMessage } = require('../../functions/common/logging');

// Khởi tạo chatHistories nếu chưa có
const chatHistories = new Map();

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('gemini')
    .setDescription('Chat with Gemini AI (Google Generative AI)')
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Your message to Gemini AI').setRequired(true)
    ),
  /** Chat with Gemini AI (Google Generative AI)
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const { user } = interaction;

    const prompt = interaction.options.getString('prompt');

    if (!prompt)
      return await interaction.reply(
        embedMessage({ desc: 'Vui lòng cung cấp một câu hỏi để trò chuyện với Gemini AI.' })
      );

    let history = chatHistories.get(user.id) || [];
    history.push({ role: 'user', parts: [{ text: prompt }] });

    // Giới hạn lịch sử trò chuyện để tránh quá dài
    if (history.length > 10) history = history.slice(history.length - 10);

    await interaction.deferReply();

    // Import động ESM module
    const mod = await import('@google/generative-ai');
    const GoogleGenerativeAI = mod.GoogleGenerativeAI || mod.default;
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Sử dụng gemini-pro cho văn bản

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    let reply = response.text();

    if (!reply) reply = 'Không thể nhận được phản hồi từ Gemini AI.';

    history.push({ role: 'model', parts: [{ text: reply }] });
    chatHistories.set(user.id, history);

    // Gửi phản hồi ban đầu
    await interaction.editReply(`**Bạn:** ${prompt}`);

    // Gửi các phần còn lại của phản hồi nếu quá dài
    for (let i = 0; i < reply.length; i += 2000) await interaction.followUp({ content: reply.slice(i, i + 2000) });
  },
};
