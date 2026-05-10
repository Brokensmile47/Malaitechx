const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Setgroupname* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: setgroupname
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Setgroupname request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('setgroupname command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *setgroupname* command.'
        }, {
            quoted: message
        });
    }
};
