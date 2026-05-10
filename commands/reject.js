const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Reject* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: reject
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Reject request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('reject command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *reject* command.'
        }, {
            quoted: message
        });
    }
};
