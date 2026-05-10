// ============================================================
// ⏱️  runtime.js — Show how long the bot has been running
// ============================================================

const settings = require('../settings');

// Record the start time when the bot first loads this file
const BOT_START_TIME = Date.now();

function formatUptime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days    > 0) parts.push(`${days}d`);
    if (hours   > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
}

module.exports = async function runtimeCommand(sock, chatId, message, args) {
    try {
        const uptime    = Date.now() - BOT_START_TIME;
        const uptimeStr = formatUptime(uptime);

        const now   = new Date();
        const since = new Date(BOT_START_TIME);

        const response =
`╭━━━〔 *⏱️ Bot Runtime* 〕━━⬣
┃
┃ 🤖 *Bot:* ${settings.botName || 'MALAITECHX'}
┃ 👑 *Owner:* ${settings.botOwner || 'Malaitechx'}
┃ 🕐 *Uptime:* ${uptimeStr}
┃ 🗓️ *Started:* ${since.toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
┃ 🌐 *Now:* ${now.toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
┃
╰━━━━━━━━━━━━━━⬣

✅ *Bot is running smoothly!*`;

        await sock.sendMessage(chatId, { text: response }, { quoted: message });

    } catch (error) {
        console.error('runtime command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching runtime info.'
        }, { quoted: message });
    }
};
