const {
  Client,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  Colors,
  ComponentType,
  ActionRowBuilder,
} = require('discord.js');
const reactionRole = require('../../config/reactionRole');
const { rowComponents } = require('../../functions/common/components');
const reactionMap = new Map();

module.exports = {
  type: 'buttons',
  data: { name: 'reaction-btn' },
  /** - Reaction Button
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, guild, channel, message, user } = interaction;
    const { errorEmbed, catchError } = client;
    const [, buttonId] = customId.split(':');
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);
    /**
     * @param {string} placeholder TextInput placeholder
     * @returns {ModalBuilder} */
    const createModal = (placeholder) => {
      const textInputs = rowComponents(
        [{ customId: buttonId, label: `Reaction Role ${buttonId}`, style: TextInputStyle.Short, placeholder }],
        ComponentType.TextInput,
      );
      const actionRows = textInputs.map((txt) => new ActionRowBuilder().addComponents(txt));
      const modal = new ModalBuilder().setCustomId(`reaction-md:${buttonId}`).setTitle('Manager Reaction Role');
      actionRows.forEach((row) => modal.addComponents(row));
      return modal;
    };

    try {
      const reactionButton = {
        title: async () => {
          return await interaction.showModal(createModal('Enter the reaction role title'));
        },
        color: async () => {
          return await interaction.showModal(createModal(Object.keys(Colors).join(',').slice(14, 114)));
        },
        add: async () => {
          if (!reactionMap.has(message.id)) reactionMap.set(message.id, []);
          const emojiArray = reactionMap.get(message.id);

          await interaction.update({
            content:
              'Vui lòng nhập **emoji và tên role** theo định dạng `emoji | @tên_role` (ví dụ: `👍 | @Tên_Role` hoặc `:custom_emoji: | @Tên_Role`).\nBạn có 5 phút để nhập. Để kết thúc nhập `Done`',
          });

          const filter = (m) => m.author.id === user.id && m.channel.id === channel.id;
          const collector = channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

          collector.on('collect', async (m) => {
            const input = m.content.trim();
            if (m && m.deletable) await m.delete().catch(console.error);
            if (input === 'done') {
              collector.stop('finish');
              return interaction.followUp(errorEmbed({ desc: 'Kết thúc thêm reaction role!', emoji: true }));
            }

            const [emojiInput, roleInput] = input.split('|').map((v) => v.trim());
            if (!emojiInput || !roleInput)
              return await interaction.followUp({ content: 'Nhập sai cú pháp `emoji | @tên_role`', flags: 64 });

            let role = roleInput;
            try {
              const roleMatch = roleInput.match(/^<@&(\d+)>$/);
              const roleId = roleMatch ? roleMatch[1] : null;

              if (roleId) role = await guild.roles.cache.get(roleId);
              else role = await guild.roles.cache.find((r) => r.name.toLowerCase() === roleInput.toLowerCase());

              if (!role)
                return await interaction.followUp(
                  errorEmbed({
                    title: '\\❌ Không tìm thấy Role',
                    description: `Role \`${roleInput}\` không tồn tại, hãy thử lại!`,
                    color: Colors.DarkVividPink,
                  }),
                );
            } catch (e) {
              return console.error(chalk.red('Error while fetching role\n'), e);
            }

            let emojiReact = emojiInput;
            const emojiMatch = emojiInput.match(/<(a)?:(\w+):(\d+)>/);
            if (emojiMatch) {
              emojiReact = `<${emojiMatch[1] ? 'a' : ''}:${emojiMatch[2]}:${emojiMatch[3]}>`;

              if (!client.emojis.cache.get(emojiMatch[3]))
                return interaction.followUp(
                  errorEmbed({ desc: `Bot không truy cập được custom emoji: ${emojiInput}` }),
                );
            }

            let desc = reactionEmbed.data.description || '';
            if (desc.includes('🎨Color')) desc = '';
            desc = desc + `\n${emojiReact} ${role}`;

            emojiArray.push({ emoji: emojiReact, roleId: role.id });

            reactionEmbed.setDescription(desc);

            await interaction.editReply({ content: '', embeds: [reactionEmbed] });
          });

          collector.on('end', async (collected, reason) => {
            if (reason === 'time') await interaction.followUp(errorEmbed({ desc: 'Hết thời gian nhập', emoji: false }));
          });
          return;
        },
        finish: async () => {
          const emojiArray = reactionMap.get(message.id) || [];

          if (emojiArray.length <= 0)
            return interaction.reply(errorEmbed({ desc: 'Thêm ít nhất một role!', emoji: false }));

          const msg = await channel.send({ embeds: [reactionEmbed] });

          await reactionRole
            .create({
              guildID: guild.id,
              guildName: guild.name,
              channelId: channel.id,
              messageId: msg.id,
              title: reactionEmbed.data.title,
              description: reactionEmbed.data.description,
              roles: emojiArray,
            })
            .catch(console.error);

          await interaction.update({
            ...errorEmbed({
              desc: `Reaction role đã được tạo: [Jump Link](${msg.url})`,
              emoji: true,
            }),
            components: [],
          });

          await Promise.all(emojiArray.map(async (e) => await msg.react(e.emoji))).catch(console.error);

          reactionMap.delete(message.id);
          return;
        },
      };

      if (!reactionButton[buttonId]) throw new Error(chalk.yellow('Invalid buttonId ') + chalk.green(buttonId));
      await reactionButton[buttonId]();
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
