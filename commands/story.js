const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Story* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: story
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Story request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('story command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *story* command.'
        }, {
            quoted: message
        });
    }
};
