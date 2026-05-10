const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Recipe* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: recipe
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Recipe request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('recipe command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *recipe* command.'
        }, {
            quoted: message
        });
    }
};
