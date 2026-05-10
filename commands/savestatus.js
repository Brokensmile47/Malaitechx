const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Savestatus* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: savestatus
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Savestatus request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('savestatus command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *savestatus* command.'
        }, {
            quoted: message
        });
    }
};
