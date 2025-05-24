const { ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { setRowComponent } = require('./components');
/**
 * Get embed color
 * @param {string} color - Color input
 * @returns {string} - Return valid color name. If invalid, return 'Random'
 */
function getEmbedColor(color) {
  const embedColors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'LuminousVividPink',
    'Fuchsia',
    'Gold',
    'Orange',
    'Purple',
    'DarkAqua',
    'DarkGreen',
    'DarkBlue',
    'DarkPurple',
    'DarkVividPink',
    'DarkGold',
    'DarkOrange',
    'DarkRed',
    'DarkGrey',
    'Navy',
    'Aqua',
    'Blurple',
    'Greyple',
    'DarkButNotBlack',
    'NotQuiteBlack',
    'White',
    'Default',
    'Random',
  ];
  /**
   * Normalize a string
   * @param {string} input - Input string
   * @returns {string} - Normalized string
   */
  function normalized(input) {
    // Remove all spaces and convert to lowercase
    return input.toLowerCase().replace(/\s/g, '');
  }
  // Check valid color name
  for (const colorName of embedColors) {
    if (normalized(colorName) === normalized(color)) return colorName;
  }
  // Return Random if invalid
  return 'Random';
}
/**
 * Tạo các button cho embed (dùng chung cho create & edit)
 * @param {ComponentType} ComponentType - ComponentType từ discord.js
 * @param {Boolean} isEdit - Nếu là edit thì customId sẽ khác
 * @returns {[ActionRowBuilder, ActionRowBuilder]}
 */
function getEmbedButtons(ComponentType, isEdit = false) {
  // Prefix cho customId để phân biệt create/edit
  const prefix = isEdit ? 'edit-embed-btn:' : 'create-embed-btn:';
  const button1 = [
    { customId: prefix + 'title', label: '💬Title', style: ButtonStyle.Primary },
    { customId: prefix + 'description', label: '💬Description', style: ButtonStyle.Primary },
    { customId: prefix + 'color', label: '🎨Color', style: ButtonStyle.Primary },
    { customId: prefix + 'thumbnail', label: '🖼️Thumbnail', style: ButtonStyle.Secondary },
    { customId: prefix + 'image', label: '🖼️Image', style: ButtonStyle.Secondary },
  ];
  const button2 = [
    { customId: prefix + 'footer', label: '⛔DisableFooter', style: ButtonStyle.Danger },
    { customId: prefix + 'timestamp', label: '⛔Disable Timestamp', style: ButtonStyle.Danger },
    { customId: prefix + 'send', label: '✅Send Embed', style: ButtonStyle.Success },
  ];
  return [
    new ActionRowBuilder().addComponents(setRowComponent(button1, ComponentType.Button)),
    new ActionRowBuilder().addComponents(setRowComponent(button2, ComponentType.Button)),
  ];
}
/**
 * Tạo modal cho từng loại chỉnh sửa embed
 * @param {String} type - Loại modal (title, description, color, image, thumbnail, footer)
 * @returns {ModalBuilder}
 */
function getEmbedModal(type) {
  // customId: 'embed-md:title', 'embed-md:description', ...
  switch (type) {
    case 'title':
      return new ModalBuilder()
        .setCustomId('embed-md:title')
        .setTitle('Embed')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('Title')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Nhập title cho embed')
              .setRequired(true),
          ),
        );
    case 'description':
      return new ModalBuilder()
        .setCustomId('embed-md:description')
        .setTitle('Embed')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('Description')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Nhập description cho embed')
              .setRequired(true),
          ),
        );
    case 'color':
      return new ModalBuilder()
        .setCustomId('embed-md:color')
        .setTitle('Embed')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('color')
              .setLabel('Color')
              .setPlaceholder('Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...')
              .setRequired(true),
          ),
        );
    case 'image':
      return new ModalBuilder()
        .setCustomId('embed-md:image')
        .setTitle('Embed')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('image')
              .setLabel('Image')
              .setPlaceholder('Nhập image cho embed, bỏ trống để xoá')
              .setRequired(false),
          ),
        );
    case 'thumbnail':
      return new ModalBuilder()
        .setCustomId('embed-md:thumbnail')
        .setTitle('Embed')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('thumbnail')
              .setLabel('Thumbnail')
              .setPlaceholder('Nhập thumbnail cho embed, bỏ trống để xoá')
              .setRequired(false),
          ),
        );
    case 'footer':
      return new ModalBuilder()
        .setCustomId('embed-md:footer')
        .setTitle('Embed')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('footer')
              .setLabel('Footer')
              .setPlaceholder('{user} = Username')
              .setRequired(false),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('footerIcon')
              .setLabel('Footer Icon Url')
              .setPlaceholder('{avatar} hoặc link (*.webp)')
              .setRequired(false),
          ),
        );
    default:
      throw new Error('Loại modal không hợp lệ!');
  }
}
module.exports = { getEmbedColor, getEmbedButtons, getEmbedModal };
