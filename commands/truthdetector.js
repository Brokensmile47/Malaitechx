const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Truthdetector* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: truthdetector
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Truthdetector request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('truthdetector command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *truthdetector* command.'
        }, {
            quoted: message
        });
    }
};
