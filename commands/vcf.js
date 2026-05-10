const settings = require('../settings');

module.exports = async function (sock, chatId, message, args) {
    try {
        const text = args.join(' ') || 'No input provided';

        const response = `╭━━━〔 *Vcf* 〕━━⬣
┃ 🤖 Bot: Malai XD
┃ 👑 Owner: Malaitechx
┃ ⚡ Command: vcf
┃ 📝 Input: ${text}
╰━━━━━━━━━━━━━━⬣

✅ Vcf request completed successfully.`;

        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('vcf command error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Error while executing *vcf* command.'
        }, {
            quoted: message
        });
    }
};
