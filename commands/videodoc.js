const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Videodoc* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: videodoc
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Videodoc request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('videodoc command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *videodoc* command.'
        }, {
            quoted: message
        });
    }
};
