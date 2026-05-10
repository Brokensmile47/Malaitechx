const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Repo* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: repo
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Repo request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('repo command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *repo* command.'
        }, {
            quoted: message
        });
    }
};
