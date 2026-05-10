// ============================================================
// 🔧  setprefix.js — Owner can change the bot command prefix
// ============================================================

const fs       = require('fs');
const path     = require('path');
const settings = require('../settings');

const configPath = path.join(__dirname, '../data/prefix.json');

// Initialise config file if missing
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify({ prefix: '.' }));
}

function getPrefix() {
    try {
        return JSON.parse(fs.readFileSync(configPath)).prefix || '.';
    } catch {
        return '.';
    }
}

async function setPrefixCommand(sock, chatId, message, senderId) {
    try {
        // Allow: bot itself, owner number, or sudo users
        const senderNumber  = (senderId || '').replace(/[^0-9]/g, '');
        const ownerNumber   = (settings.ownerNumber || '').replace(/[^0-9]/g, '');
        const isFromMe      = message.key.fromMe;

        let isSudo = false;
        try {
            const { isSudo: checkSudo } = require('../lib/index');
            isSudo = await checkSudo(senderId);
        } catch (_) {}

        const isOwner = isFromMe || senderNumber === ownerNumber || isSudo;

        if (!isOwner) {
            await sock.sendMessage(chatId, {
                text: '❌ Only the bot owner can change the prefix!'
            }, { quoted: message });
            return;
        }

        const fullText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || ''
        ).trim();

        const parts     = fullText.split(/\s+/);
        const newPrefix = parts[1];

        if (!newPrefix) {
            const current = getPrefix();
            await sock.sendMessage(chatId, {
                text:
`🔧 *Set Prefix*

📌 Current Prefix : *${current}*

Usage   : .setprefix <new_prefix>
Example : .setprefix !
Example : .setprefix #

*Note: Only the owner can change the prefix.*`
            }, { quoted: message });
            return;
        }

        if (newPrefix.length > 5) {
            await sock.sendMessage(chatId, {
                text: '❌ Prefix too long! Maximum 5 characters.'
            }, { quoted: message });
            return;
        }

        fs.writeFileSync(configPath, JSON.stringify({ prefix: newPrefix }));

        await sock.sendMessage(chatId, {
            text:
`✅ *Prefix updated!*

📌 New Prefix : *${newPrefix}*
Example       : *${newPrefix}help*`
        }, { quoted: message });

    } catch (err) {
        console.error('Error in setPrefixCommand:', err.message);
        await sock.sendMessage(chatId, {
            text: '❌ Error changing prefix. Please try again.'
        }, { quoted: message });
    }
}

module.exports = { setPrefixCommand, getPrefix };

// Malai XD dynamic prefix enabled
