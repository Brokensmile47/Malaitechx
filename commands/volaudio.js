const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Volaudio* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: volaudio
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Volaudio request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('volaudio command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *volaudio* command.'
        }, {
            quoted: message
        });
    }
};
