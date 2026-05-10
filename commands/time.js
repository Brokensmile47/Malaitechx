// ============================================================
// 🕐  time.js — Show current date & time for multiple zones
// ============================================================

const settings = require('../settings');

module.exports = async function timeCommand(sock, chatId, message, args) {
    try {
        const now = new Date();

        // Helper: format a date in a specific timezone
        const fmt = (tz) => now.toLocaleString('en-GB', {
            timeZone: tz,
            weekday: 'short',
            year:    'numeric',
            month:   'short',
            day:     '2-digit',
            hour:    '2-digit',
            minute:  '2-digit',
            second:  '2-digit',
            hour12:  false
        });

        const response =
`╭━━━〔 *🕐 Current Time* 〕━━⬣
┃
┃ 🇰🇪 *Nairobi (EAT):*
┃     ${fmt('Africa/Nairobi')}
┃
┃ 🌍 *Lagos (WAT):*
┃     ${fmt('Africa/Lagos')}
┃
┃ 🌐 *London (UTC/BST):*
┃     ${fmt('Europe/London')}
┃
┃ 🇺🇸 *New York (ET):*
┃     ${fmt('America/New_York')}
┃
┃ 🇦🇪 *Dubai (GST):*
┃     ${fmt('Asia/Dubai')}
┃
╰━━━━━━━━━━━━━━⬣

⚡ Powered by *${settings.botName || 'MALAITECHX'}*`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });

    } catch (error) {
        console.error('time command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching time.'
        }, { quoted: message });
    }
};
