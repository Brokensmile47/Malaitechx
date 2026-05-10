const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Video* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: video
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Video request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('video command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *video* command.'
        }, {
            quoted: message
        });
    }
};
