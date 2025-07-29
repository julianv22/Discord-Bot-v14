const {
  Client,
  Interaction,
  ContainerBuilder,
  ActionRowBuilder,
  SeparatorBuilder,
  ComponentType,
  MessageFlags,
  ButtonStyle,
  Colors,
} = require('discord.js');
const path = require('path');
const { readFiles } = require('../../functions/common/initLoader');
const { textDisplay, rowComponents, sectionComponents } = require('../../functions/common/components');

module.exports = {
  type: 'menus',
  data: { name: 'structure-menu' },
  /** - Statistics channel select menu
   * @param {Interaction} interaction Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { values } = interaction;
    const ignorePatterns = ['node_modules', '.git', '.gitignore', '.env', 'package-lock.json'];

    const mainFolders = readFiles(process.cwd(), { isDir: true, filter: (folder) => !ignorePatterns.includes(folder) });

    const subFolders =
      values[0] !== process.cwd()
        ? readFiles(values[0], { isDir: true, filter: (folder) => !ignorePatterns.includes(folder) })
        : [];

    const mainMenu = [
      { customId: 'structure-menu:main', placeholder: '⚙️ Select folder to display structure' },
      {
        emoji: '📂',
        label: 'Root',
        value: process.cwd(),
        description: 'Root Directory',
        default: values[0] === process.cwd(),
      },
      ...mainFolders.map((folder) => ({
        label: ` └──📂 ${folder.toCapitalize()}`,
        value: folder,
        default: folder === values[0],
      })),
    ];

    const subMenu = [
      { customId: 'structure-menu:sub', placeholder: '⚙️ Select sub folder to display structure' },
      ...subFolders.map((folder) => ({ label: `📂 ${folder.toCapitalize()}`, value: path.join(values[0], folder) })),
    ];

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addTextDisplayComponents(textDisplay("### \\📂 Displays the project's folder structure."))
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(ComponentType.StringSelect, mainMenu))
      );

    if (subFolders.length > 1)
      container.addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(ComponentType.StringSelect, subMenu))
      );

    const folderName = values[0] === process.cwd() ? 'root' : values[0];
    container.addSeparatorComponents(new SeparatorBuilder()).addSectionComponents(
      sectionComponents(`### \\📂 ${folderName}`, ComponentType.Button, {
        customId: `read-structure:${folderName}`,
        label: 'Read Structure',
        style: ButtonStyle.Primary,
      })
    );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  },
};
