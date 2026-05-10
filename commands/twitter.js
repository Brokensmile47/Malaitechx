const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Twitter* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: twitter
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Twitter request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('twitter command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *twitter* command.'
        }, {
            quoted: message
        });
    }
};
