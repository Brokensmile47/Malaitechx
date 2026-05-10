const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Topography* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: topography
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Topography request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('topography command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *topography* command.'
        }, {
            quoted: message
        });
    }
};
