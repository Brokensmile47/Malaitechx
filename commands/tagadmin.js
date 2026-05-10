const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Tagadmin* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: tagadmin
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Tagadmin request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('tagadmin command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *tagadmin* command.'
        }, {
            quoted: message
        });
    }
};
