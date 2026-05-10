const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Userid* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: userid
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Userid request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('userid command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *userid* command.'
        }, {
            quoted: message
        });
    }
};
