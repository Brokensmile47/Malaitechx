const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Translate2* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: translate2
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Translate2 request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('translate2 command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *translate2* command.'
        }, {
            quoted: message
        });
    }
};
