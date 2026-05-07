const fs = require('fs');

const readJSON = (path) => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch {
        return {};
    }
};

const presenceCommand = async (sock, chatId, message) => {
    try {

        const autotypingEnabled = readJSON('./data/autotyping.json').enabled;
        const autoreadEnabled = readJSON('./data/autoread.json').enabled;
        const autorecordEnabled = readJSON('./data/autorecord.json').enabled;
        const autostatusEnabled = readJSON('./data/autostatus.json').enabled;
        const antideleteEnabled = readJSON('./data/antidelete.json').enabled;
        const antilinkEnabled = readJSON('./data/antilink.json').enabled;

        const chatbotEnabled =
            readJSON(`./data/chatbot.json`).enabled;

        const on = '✅ *ON*';
        const off = '❌ *OFF*';

        const presenceText = `╔════════════════════╗
║    👁️ BOT PRESENCE STATUS
╚════════════════════╝

┌─────────────────────
│ 🤖 *Auto Typing*    : ${autotypingEnabled ? on : off}
│ 👁️ *Auto Read*      : ${autoreadEnabled ? on : off}
│ 🎙️ *Auto Record*    : ${autorecordEnabled ? on : off}
│ 📊 *Auto Status*    : ${autostatusEnabled ? on : off}
│ 💬 *Chatbot*        : ${chatbotEnabled ? on : off}
│ 🔁 *Anti Delete*    : ${antideleteEnabled ? on : off}
│ 🔗 *Anti Link*      : ${antilinkEnabled ? on : off}
└─────────────────────

⚡ Powered by *MALAITECHX*`;

        await sock.sendMessage(chatId, {
            text: presenceText
        }, { quoted: message });

    } catch (error) {
        console.error('Error in presenceCommand:', error);
    }
};

module.exports = presenceCommand;
