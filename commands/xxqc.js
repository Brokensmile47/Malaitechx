const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Xxqc* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: xxqc
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Xxqc request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('xxqc command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *xxqc* command.'
        }, {
            quoted: message
        });
    }
};
