const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Setdesc* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: setdesc
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Setdesc request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('setdesc command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *setdesc* command.'
        }, {
            quoted: message
        });
    }
};
