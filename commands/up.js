const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data/up');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFile = (chatId) => path.join(DATA_DIR, `${chatId}.json`);

function loadData(chatId) {

    const file = getFile(chatId);

    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({}, null, 2));
    }

    return JSON.parse(fs.readFileSync(file));
}

function saveData(chatId, data) {
    fs.writeFileSync(getFile(chatId), JSON.stringify(data, null, 2));
}

/**
 * Track Messages
 */
async function trackMessages(message) {

    const chatId = message.key.remoteJid;

    if (!chatId.endsWith('@g.us')) return;

    const sender =
        message.key.participant ||
        message.key.remoteJid;

    const data = loadData(chatId);

    if (!data[sender]) {
        data[sender] = 0;
    }

    data[sender] += 1;

    saveData(chatId, data);
}

/**
 * .up
 */
async function upCommand(sock, chatId, message) {

    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: '❌ This command only works in groups.'
        }, { quoted: message });
    }

    const data = loadData(chatId);

    const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        return await sock.sendMessage(chatId, {
            text: '❌ No ranking data yet.'
        }, { quoted: message });
    }

    let text = `🏆 *GROUP TALKATIVE RANKING*\n\n`;

    sorted.forEach(([jid, count], index) => {
        text += `${index + 1}. @${jid.split('@')[0]} — ${count} messages\n`;
    });

    const mentions = sorted.map(v => v[0]);

    await sock.sendMessage(chatId, {
        text,
        mentions
    }, { quoted: message });
}

module.exports = {
    upCommand,
    trackMessages
};
