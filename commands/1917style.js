const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *1917Style* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: 1917style
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ 1917Style request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('1917style command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *1917style* command.'
        }, {
            quoted: message
        });
    }
};
