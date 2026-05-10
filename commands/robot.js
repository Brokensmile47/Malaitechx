const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Robot* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: robot
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Robot request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('robot command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *robot* command.'
        }, {
            quoted: message
        });
    }
};
