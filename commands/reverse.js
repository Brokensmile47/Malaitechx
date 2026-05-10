const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Reverse* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: reverse
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Reverse request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('reverse command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *reverse* command.'
        }, {
            quoted: message
        });
    }
};
