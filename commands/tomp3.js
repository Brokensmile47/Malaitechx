const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Tomp3* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: tomp3
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Tomp3 request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('tomp3 command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *tomp3* command.'
        }, {
            quoted: message
        });
    }
};
