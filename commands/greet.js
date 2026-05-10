const fs = require('fs');
const path = require('path');
const settings = require('../settings');

const configPath = path.join(__dirname, '../data/greet.json');

// Initialize config if it doesn't exist
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify({ enabled: false }));
}

async function greetCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = message.key.fromMe || senderId.includes(settings.ownerNumber);

        if (!isOwner) {
            await sock.sendMessage(chatId, {
                text: '❌ Only the owner can use this command!'
            }, { quoted: message });
            return;
        }

        let config = JSON.parse(fs.readFileSync(configPath));
        const text = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || ''
        ).trim().toLowerCase();

        const args = text.split(/\s+/).slice(1);
        const action = args[0];

        if (!action) {
            const status = config.enabled ? '✅ Enabled' : '❌ Disabled';
            await sock.sendMessage(chatId, {
                text: `👋 *Greet Command Settings*\n\n📌 Status: ${status}\n\nUsage:\n.greet on — Enable greet\n.greet off — Disable greet\n\n*When enabled, anyone who messages the bot in private chat will receive an offline message.*`
            }, { quoted: message });
            return;
        }

        if (action === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, {
                text: '✅ Greet has been enabled!\nAnyone who messages the bot privately will now receive an offline notification.'
            }, { quoted: message });
        } else if (action === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, {
                text: '❌ Greet has been disabled!'
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid option. Use .greet on or .greet off'
            }, { quoted: message });
        }
    } catch (err) {
        console.error('Error in greetCommand:', err);
    }
}

async function handleGreet(sock, chatId, message, senderId) {
    try {
        // Only private chats
        if (chatId.endsWith('@g.us')) return;
        // Don't reply to self
        if (message.key.fromMe) return;

        let config;
        try {
            config = JSON.parse(fs.readFileSync(configPath));
        } catch {
            return;
        }
        if (!config.enabled) return;

        const ownerName = settings.botOwner || 'Owner';

        await sock.sendMessage(chatId, {
            text: `*${ownerName}* 👑 is currently offline, please try again later❗❗\n\n*IF IT'S A SCAM KEEP OFF!*`
        });
    } catch (err) {
        console.error('Error in handleGreet:', err);
    }
}

function isGreetEnabled() {
    try {
        return JSON.parse(fs.readFileSync(configPath)).enabled;
    } catch {
        return false;
    }
}

module.exports = { greetCommand, handleGreet, isGreetEnabled };
