const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data/goodbye');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFile = (chatId) =>
    path.join(DATA_DIR, `${chatId}.json`);

function loadConfig(chatId) {

    const file = getFile(chatId);

    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            enabled: false
        }, null, 2));
    }

    return JSON.parse(fs.readFileSync(file));
}

function saveConfig(chatId, data) {
    fs.writeFileSync(getFile(chatId), JSON.stringify(data, null, 2));
}

/**
 * .goodbye on/off
 */
async function goodbyeCommand(sock, chatId, message, args) {

    const config = loadConfig(chatId);

    if (!args[0]) {
        return await sock.sendMessage(chatId, {
            text:
`👋 *GOODBYE SETTINGS*

Status: ${config.enabled ? '✅ ON' : '❌ OFF'}

Usage:
.goodbye on
.goodbye off`
        }, { quoted: message });
    }

    const action = args[0].toLowerCase();

    if (action === 'on') {
        config.enabled = true;
    }

    else if (action === 'off') {
        config.enabled = false;
    }

    saveConfig(chatId, config);

    await sock.sendMessage(chatId, {
        text:
`✅ Goodbye has been ${config.enabled ? 'enabled' : 'disabled'}`
    }, { quoted: message });
}

/**
 * Handle Goodbye
 */
async function handleGoodbye(sock, update) {

    const chatId = update.id;

    const config = loadConfig(chatId);

    if (!config.enabled) return;

    if (update.action !== 'remove') return;

    for (const participant of update.participants) {

        const metadata =
            await sock.groupMetadata(chatId);

        const user = participant;

        const username =
            user.split('@')[0];

        let groupPP;

        try {
            groupPP =
                await sock.profilePictureUrl(chatId, 'image');
        }

        catch {
            groupPP =
                'https://i.imgur.com/6WNZQ7D.jpeg';
        }

        const text =
`😢 Goodbye @${username}

📛 Group: ${metadata.subject}
👥 Members Left: ${metadata.participants.length}

💔 We will miss you...`;

        await sock.sendMessage(chatId, {
            image: { url: groupPP },
            caption: text,
            mentions: [user]
        });
    }
}

module.exports = {
    goodbyeCommand,
    handleGoodbye
};
