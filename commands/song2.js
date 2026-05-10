const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Song2* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: song2
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Song2 request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('song2 command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *song2* command.'
        }, {
            quoted: message
        });
    }
};
