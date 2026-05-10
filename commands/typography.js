const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Typography* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: typography
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Typography request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('typography command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *typography* command.'
        }, {
            quoted: message
        });
    }
};
