const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Writetext* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: writetext
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Writetext request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('writetext command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *writetext* command.'
        }, {
            quoted: message
        });
    }
};
