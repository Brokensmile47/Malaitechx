const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Toptt* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: toptt
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Toptt request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('toptt command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *toptt* command.'
        }, {
            quoted: message
        });
    }
};
