const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Setppgroup* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: setppgroup
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Setppgroup request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('setppgroup command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *setppgroup* command.'
        }, {
            quoted: message
        });
    }
};
