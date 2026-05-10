const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Telesticker* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: telesticker
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Telesticker request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('telesticker command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *telesticker* command.'
        }, {
            quoted: message
        });
    }
};
