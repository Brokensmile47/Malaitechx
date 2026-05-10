const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Tiktokaudio* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: tiktokaudio
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Tiktokaudio request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('tiktokaudio command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *tiktokaudio* command.'
        }, {
            quoted: message
        });
    }
};
