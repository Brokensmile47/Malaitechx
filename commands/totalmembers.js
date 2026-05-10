const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Totalmembers* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: totalmembers
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Totalmembers request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('totalmembers command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *totalmembers* command.'
        }, {
            quoted: message
        });
    }
};
