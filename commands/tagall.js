const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Tagall* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: tagall
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Tagall request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('tagall command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *tagall* command.'
        }, {
            quoted: message
        });
    }
};
