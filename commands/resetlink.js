const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Resetlink* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: resetlink
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Resetlink request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('resetlink command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *resetlink* command.'
        }, {
            quoted: message
        });
    }
};
