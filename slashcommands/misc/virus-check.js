const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('virus-check')
    .setDescription('Check a URL with VirusTotal.')
    .addStringOption((option) =>
      option.setName('url').setDescription('URL to check (example: https://example.com)').setRequired(true),
    ),
  /** - Kiểm tra một URL có độc hại không bằng VirusTotal
   * @param {ChatInputCommandInteraction} interaction - Đối tượng tương tác (SlashChatInputCommandInteraction)
   * @param {Client} client - Đối tượng Client của bot */
  async execute(interaction, client) {
    const { options, user, guild } = interaction;
    const { errorEmbed } = client;
    const inputUrl = options.getString('url');

    await interaction.deferReply({ flags: 64 });
    // Hàm helper để gửi embed (sử dụng editReply vì đã defer)
    const sendResponseEmbed = async (title, description, color = 'Random') => {
      const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(description);
      await interaction.editReply({ embeds: [embed] });
    };
    // Hàm mã hóa URL sang Base64 URL-safe (không padding)
    // Đây là định dạng mà VirusTotal cần cho endpoint GET /urls/{id}
    const encodeUrlToBase64 = (url) => {
      // encodeURIComponent xử lý các ký tự đặc biệt trước khi mã hóa Base64
      const encoded = Buffer.from(encodeURIComponent(url)).toString('base64');
      // Thay thế + bằng -, / bằng _, và loại bỏ padding =
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    // Kiểm tra báo cáo URL hiện có trên VirusTotal ---
    const encodedUrl = encodeUrlToBase64(inputUrl);
    let analysisReport = null;
    try {
      // Cố gắng lấy báo cáo URL trực tiếp bằng hash (Base64 URL-safe)
      const getReportRes = await fetch(`${'https://www.virustotal.com/api/v3'}/urls/${encodedUrl}`, {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY,
          Accept: 'application/json',
        },
      });

      if (getReportRes.ok) {
        // Nếu mã trạng thái là 200 OK
        const reportData = await getReportRes.json();
        if (reportData.data && reportData.data.attributes) {
          analysisReport = reportData.data;
        }
      } else if (getReportRes.status === 404) {
        // URL chưa có báo cáo, cần gửi để phân tích mới
        await sendResponseEmbed(
          'Đang quét URL...',
          `URL '${inputUrl}' chưa có báo cáo sẵn. Đang gửi để phân tích mới. Vui lòng chờ...`,
        );
      } else {
        // Xử lý các lỗi khác khi lấy báo cáo (ví dụ: 403 Forbidden, 429 Too Many Requests)
        const errorDetail = await getReportRes.json();
        console.error(
          `[VIRUS-CHECK] Lỗi khi lấy báo cáo URL theo hash: ${getReportRes.status} - ${JSON.stringify(errorDetail)}`,
          'Red',
        );
        return await interaction.editReply(
          errorEmbed({
            desc: `Không thể lấy báo cáo URL hiện có: ${
              errorDetail.error ? errorDetail.error.message : getReportRes.statusText
            }`,
            emoji: false,
          }),
        );
      }
    } catch (e) {
      console.error('[VIRUS-CHECK] Lỗi khi cố gắng lấy báo cáo URL theo hash:', e);
      // Tiếp tục sang bước phân tích mới nếu có lỗi mạng hoặc lỗi khác
    }
    // Nếu chưa có báo cáo, gửi URL để phân tích mới ---
    let scanId;
    if (!analysisReport) {
      try {
        const submitRes = await fetch(
          `${process.env.VIRUS_TOTAL_BASE_URL || 'https://www.virustotal.com/api/v3'}/urls`,
          {
            method: 'POST',
            headers: {
              'x-apikey': process.env.VIRUSTOTAL_API_KEY,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(inputUrl)}`, // Đảm bảo URL được encode đúng cách cho body
          },
        );

        if (!submitRes.ok) {
          const errorDetail = await submitRes.json();
          console.error(
            `[VIRUS-CHECK] Lỗi khi gửi URL để phân tích: ${submitRes.status} - ${JSON.stringify(errorDetail)}`,
          );
          return await interaction.editReply(
            errorEmbed({
              desc: `Không thể gửi URL để phân tích: ${
                errorDetail.error ? errorDetail.error.message : submitRes.statusText
              }`,
              emoji: false,
            }),
          );
        }

        const submitData = await submitRes.json();
        if (!submitData.data || !submitData.data.id) {
          return await interaction.editReply(
            errorEmbed({ desc: 'Không nhận được ID phân tích từ VirusTotal.', emoji: false }),
          );
        }
        scanId = submitData.data.id;

        // Chờ và lấy báo cáo phân tích mới ---
        let attempts = 0;
        const maxAttempts = 5; // Số lần thử lại tối đa
        const delayMs = 10000; // Khoảng thời gian chờ giữa các lần thử (10 giây)

        await sendResponseEmbed(
          'Đang phân tích...',
          `Đang chờ VirusTotal hoàn tất phân tích cho URL của bạn. Vui lòng đợi trong giây lát...`,
        );

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs)); // Đợi trước khi thử lại

          const analysisRes = await fetch(
            `${process.env.VIRUS_TOTAL_BASE_URL || 'https://www.virustotal.com/api/v3'}/analyses/${scanId}`,
            {
              headers: {
                'x-apikey': process.env.VIRUSTOTAL_API_KEY,
                Accept: 'application/json',
              },
            },
          );

          if (!analysisRes.ok) {
            const errorDetail = await analysisRes.json();
            console.error(
              `[VIRUS-CHECK] Lỗi khi lấy báo cáo phân tích: ${analysisRes.status} - ${JSON.stringify(errorDetail)}`,
            );
            return await interaction.editReply(
              errorEmbed({
                desc: `Không thể lấy báo cáo phân tích: ${
                  errorDetail.error ? errorDetail.error.message : analysisRes.statusText
                }`,
                emoji: false,
              }),
            );
          }

          const analysisData = await analysisRes.json();
          if (
            analysisData.data &&
            analysisData.data.attributes &&
            analysisData.data.attributes.status === 'completed'
          ) {
            analysisReport = analysisData.data;
            break; // Phân tích hoàn tất, thoát vòng lặp
          }

          attempts++;
          if (attempts < maxAttempts) {
            await sendResponseEmbed(
              'Đang phân tích...',
              `Phân tích chưa hoàn tất. Đang thử lại (${attempts}/${maxAttempts})...`,
            );
          }
        }

        if (!analysisReport) {
          return await interaction.editReply(
            errorEmbed({
              desc: 'VirusTotal chưa hoàn tất phân tích sau nhiều lần thử. Vui lòng thử lại sau.',
              emoji: false,
            }),
          );
        }
      } catch (e) {
        console.error('[VIRUS-CHECK] Lỗi trong quá trình gửi/phân tích URL mới:', e);
        return await interaction.editReply(
          errorEmbed({
            desc: `Đã xảy ra lỗi trong quá trình gửi hoặc phân tích URL: ${e.message}`,
            emoji: false,
          }),
        );
      }
    }

    // Hiển thị kết quả ---
    if (analysisReport) {
      const attributes = analysisReport.attributes;
      const stats = attributes.last_analysis_stats || attributes.stats; // Lấy stats tùy thuộc vào loại báo cáo
      // Xử lý URL nếu nó là báo cáo phân tích (analysis)
      // URL từ báo cáo GET /urls/{id} sẽ nằm trong attributes.url
      // URL từ báo cáo GET /analyses/{id} có thể không có trực tiếp, hoặc từ id ban đầu
      const displayUrl = attributes.url || inputUrl;

      const total = stats.harmless + stats.malicious + stats.suspicious + stats.undetected + (stats.timeout || 0); // timeout có thể không tồn tại

      // Link chi tiết tới VirusTotal GUI
      //   let vtGuiLink = `https://www.virustotal.com/gui/url/${encodedUrl}/detection`;
      if (analysisReport.type === 'analysis') {
        // Đối với báo cáo phân tích mới, link sẽ khác một chút
        vtGuiLink = `https://www.virustotal.com/gui/url/${scanId}/detection`;
      } else if (analysisReport.type === 'url') {
        // Đối với báo cáo URL có sẵn, link sẽ dùng ID của URL
        vtGuiLink = `https://www.virustotal.com/gui/url/${analysisReport.id}/detection`;
      }

      const resultEmbed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
        .setColor(stats.malicious > 0 ? 'Red' : 'Green') // Đỏ nếu có độc hại, xanh nếu an toàn
        .setTitle(
          `Kết quả kiểm tra VirusTotal cho ${
            displayUrl.length > 50 ? `${displayUrl.substring(0, 47)}...` : displayUrl
          }`,
        )
        .addFields(
          { name: 'Tổng số engine', value: `${total}`, inline: true },
          { name: 'Độc hại', value: `${stats.malicious || 0}`, inline: true },
          { name: 'Nguy hiểm tiềm tàng', value: `${stats.suspicious || 0}`, inline: true },
          { name: 'Vô hại', value: `${stats.harmless || 0}`, inline: true },
          { name: 'Không phát hiện', value: `${stats.undetected || 0}`, inline: true },
          { name: 'Hết giờ', value: `${stats.timeout || 0}`, inline: true },
        )
        // .setDescription(`[Xem chi tiết trên VirusTotal](${vtGuiLink})`)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp();

      return await interaction.editReply({
        embeds: [resultEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('🔗Xem chi tiết trên VirusTotal').setURL(vtGuiLink).setStyle(ButtonStyle.Link),
          ),
        ],
      });
    } else {
      // Trường hợp này chỉ xảy ra nếu có lỗi không mong muốn hoặc phân tích không bao giờ hoàn tất
      return await interaction.editReply(
        errorEmbed({
          desc: 'Không thể lấy kết quả phân tích cuối cùng từ VirusTotal. Vui lòng thử lại sau.',
          emoji: false,
        }),
      );
    }
  },
};
