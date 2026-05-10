const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Wallpaper* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: wallpaper
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Wallpaper request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('wallpaper command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *wallpaper* command.'
        }, {
            quoted: message
        });
    }
};
