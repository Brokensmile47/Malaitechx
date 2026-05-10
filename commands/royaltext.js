const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Royaltext* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: royaltext
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Royaltext request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('royaltext command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *royaltext* command.'
        }, {
            quoted: message
        });
    }
};
