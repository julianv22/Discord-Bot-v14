const { Locale } = require('discord.js');

let _client;

module.exports = {
  init: (client) => (_client = client),
  logError: (...args) => {
    if (!_client) return console.error('Client not initialized for utils.js!');
    _client.logError(...args);
  },
  /**
   *
   * @param {number} balance Number to convert to currency
   * @param {Locale} userLocale
   * @returns
   */
  toCurrency: (balance, userLocale = 'vi-VN') => {
    console.log('🚀 ~ userLocale:', userLocale);
    const CurrencyMap = {
      'en-US': 'USD', // Tiếng Anh (Mỹ) -> Đô la Mỹ
      'en-GB': 'USD',
      'vi-VN': 'VND', // Tiếng Việt -> Đồng Việt Nam
      ja: 'JPY', // Tiếng Nhật -> Yên Nhật
      'zh-CN': 'CNY', // Tiếng Trung giản thể (Trung Quốc) -> Nhân dân tệ
      ko: 'KRW', // Tiếng Hàn -> Won Hàn Quốc
      fr: 'EUR', // Tiếng Pháp (hoặc các ngôn ngữ châu Âu khác) -> Euro
      de: 'EUR', // Tiếng Đức -> Euro
      'es-ES': 'EUR', // Tiếng Tây Ban Nha -> Euro
    };

    try {
      return balance.toLocaleString(userLocale, {
        style: 'currency',
        currency: CurrencyMap[userLocale] || 'VND',
        minimumFractionDigits: 0, // Điều chỉnh số chữ số thập phân tối thiểu
        maximumFractionDigits: 2, // Điều chỉnh số chữ số thập phân tối đa
      });
    } catch (e) {
      console.error(`Lỗi định dạng số tiền cho locale ${userLocale} và tiền tệ ${currencyCode}:`, e);
      // return balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  },
};
