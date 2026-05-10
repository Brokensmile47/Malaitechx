const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Summerbeach* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: summerbeach
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Summerbeach request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('summerbeach command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *summerbeach* command.'
        }, {
            quoted: message
        });
    }
};
