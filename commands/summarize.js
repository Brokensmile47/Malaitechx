const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Summarize* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: summarize
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Summarize request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('summarize command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *summarize* command.'
        }, {
            quoted: message
        });
    }
};
