const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Tag* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: tag
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Tag request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('tag command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *tag* command.'
        }, {
            quoted: message
        });
    }
};
