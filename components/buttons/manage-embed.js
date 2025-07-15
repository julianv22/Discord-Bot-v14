const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  ButtonStyle,
  TextInputStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'manage-embed' },
  /** - Create/edit embed
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, message, channel } = interaction;
    const { errorEmbed, catchError } = client;
    const [, button, messageId] = customId.split(':');
    const editEmbed = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);

    if (!message) return await interaction.reply(errorEmbed({ desc: 'Không tìm thấy tin nhắn!' }));

    /** - Create Interaction Modal
     * @param {object[]} options */
    const createModal = (options) => {
      const textInputs = rowComponents(options, ComponentType.TextInput);
      const actionRows = textInputs.map((txt) => new ActionRowBuilder().addComponents(txt));
      const modal = new ModalBuilder().setCustomId(customId).setTitle('Embed Manager');
      actionRows.forEach((row) => modal.addComponents(row));
      return modal;
    };

    const showModal = {
      author: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Tác giả Embed, biến: {guild}, {user}',
              placeholder: '{guild} = Tên máy chủ, {user} = Tên người dùng',
            },
            {
              customId: 'authorIcon',
              label: 'Biểu tượng tác giả (*.webp)',
              placeholder: '{avatar} = Ảnh đại diện người dùng, {iconURL} = Biểu tượng máy chủ',
            },
          ])
        );
      },
      title: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Tiêu đề Embed',
              placeholder: '{guild} = Tên máy chủ, {user} = Tên người dùng',
              required: true,
            },
          ])
        );
      },
      description: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Mô tả',
              placeholder: 'Nhập mô tả embed\n{guild} = Tên máy chủ\n{user} = Tên người dùng',
              value: editEmbed.data.description,
              style: TextInputStyle.Paragraph,
              required: true,
            },
          ])
        );
      },
      color: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Màu sắc (Để trống = Ngẫu nhiên)',
              placeholder: Object.keys(Colors).join(',').slice(14, 114),
            },
          ])
        );
      },
      image: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Hình ảnh (Để trống = Xóa)',
              placeholder: 'Nhập URL hình ảnh, Để trống = Xóa',
            },
          ])
        );
      },
      thumbnail: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Hình thu nhỏ (Để trống = Xóa)',
              placeholder: 'Nhập URL hình thu nhỏ, Để trống = Xóa',
            },
          ])
        );
      },
      footer: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: button,
              label: 'Chân trang (Để trống = Xóa)',
              placeholder: '{guild} = Tên máy chủ, {user} = Tên người dùng',
            },
            {
              customId: button + 'Icon',
              label: 'Biểu tượng chân trang (*.webp)',
              placeholder: '{avatar} = Ảnh đại diện người dùng, {iconURL} = Biểu tượng máy chủ',
            },
          ])
        );
      },
      timestamp: async () => {
        const timestampButton = Button1.components[2];
        if (timestampButton.data.style === ButtonStyle.Danger) {
          editEmbed.setTimestamp(null);
          timestampButton.setLabel('✅Timestamp').setStyle(ButtonStyle.Success);
        } else {
          editEmbed.setTimestamp();
          timestampButton.setLabel('⛔Timestamp').setStyle(ButtonStyle.Danger);
        }

        return await interaction.update({
          embeds: [editEmbed],
          components: [Button0, Button1],
          flags: 64,
        });
      },
      send: async () => {
        try {
          [...Button0.components, ...Button1.components].forEach((button) => (button.data.disabled = true));

          if (!messageId || messageId === 'undefined') {
            await channel.send({ embeds: [editEmbed] });
            await interaction.update({ components: [Button0, Button1] });
          } else {
            const msg = await channel.messages.fetch(messageId);
            if (!msg)
              return await interaction.reply(
                errorEmbed({ desc: 'Không tìm thấy tin nhắn hoặc tin nhắn không ở kênh này.' })
              );

            await msg.edit({ embeds: [editEmbed] }).catch(console.error);
            return await interaction.update({
              embeds: [
                {
                  title: '\\✅ Cập nhật thành công!',
                  description: `Tin nhắn đã được cập nhật thành công.\n\n[Chuyển đến tin nhắn](${msg.url})`,
                },
              ],
              components: [Button0, Button1],
            });
          }
        } catch (e) {
          catchError(interaction, e, 'Lỗi khi cập nhật tin nhắn embed');
        }
      },
    };

    if (!showModal[button]) throw new Error(chalk.yellow("Invalid button's customId"), chalk.green(button));

    await showModal[button]();
  },
};
