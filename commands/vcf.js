const fs = require('fs');
const path = require('path');

async function vcfCommand(sock, chatId, message) {

    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: '❌ This command only works in groups.'
        }, { quoted: message });
    }

    const metadata = await sock.groupMetadata(chatId);

    let vcf = '';

    for (const participant of metadata.participants) {

        const number = participant.id.split('@')[0];

        vcf += `BEGIN:VCARD\n`;
        vcf += `VERSION:3.0\n`;
        vcf += `FN:${number}\n`;
        vcf += `TEL;type=CELL;type=VOICE;waid=${number}:+${number}\n`;
        vcf += `END:VCARD\n`;
    }

    const filePath = path.join(__dirname, `../tmp/${metadata.subject}.vcf`);

    fs.writeFileSync(filePath, vcf);

    await sock.sendMessage(chatId, {
        document: { url: filePath },
        mimetype: 'text/vcard',
        fileName: `${metadata.subject}.vcf`,
        caption: '✅ Group contacts exported successfully.'
    }, { quoted: message });
}

module.exports = vcfCommand;
