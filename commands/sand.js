const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Sand* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: sand
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Sand request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('sand command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *sand* command.'
        }, {
            quoted: message
        });
    }
};
