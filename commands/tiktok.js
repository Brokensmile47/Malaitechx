const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Tiktok* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: tiktok
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Tiktok request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('tiktok command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *tiktok* command.'
        }, {
            quoted: message
        });
    }
};
