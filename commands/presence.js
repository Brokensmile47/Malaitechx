// 👁️ presence.js — Show bot presence/feature status

const fs = require('fs');

const presenceCommand = async (sock, chatId, message) => {
    try {
        // Read autotyping state
        let autotypingEnabled = false;
        let autoreadEnabled = false;
        let autorecordEnabled = false;
        let autostatusEnabled = false;
        let chatbotEnabled = false;
        let antideleteEnabled = false;
        let antilinkEnabled = false;

        // Try reading states from data files
        try {
            const at = JSON.parse(fs.readFileSync('./data/autotyping.json', 'utf8'));
            autotypingEnabled = at.enabled || false;
        } catch (_) {}

        try {
            const ar = JSON.parse(fs.readFileSync('./data/autoread.json', 'utf8'));
            autoreadEnabled = ar.enabled || false;
        } catch (_) {}

        try {
            const arc = JSON.parse(fs.readFileSync('./data/autorecord.json', 'utf8'));
            autorecordEnabled = arc.enabled || false;
        } catch (_) {}

        try {
            const as = JSON.parse(fs.readFileSync('./data/autostatus.json', 'utf8'));
            autostatusEnabled = as.enabled || false;
        } catch (_) {}

        try {
            const cb = JSON.parse(fs.readFileSync(`./data/chatbot_${chatId}.json`, 'utf8'));
            chatbotEnabled = cb.enabled || false;
        } catch (_) {}

        try {
            const ad = JSON.parse(fs.readFileSync(`./data/antidelete_${chatId}.json`, 'utf8'));
            antideleteEnabled = ad.enabled || false;
        } catch (_) {}

        try {
            const al = JSON.parse(fs.readFileSync(`./data/antilink_${chatId}.json`, 'utf8'));
            antilinkEnabled = al.enabled || false;
        } catch (_) {}

        const on  = '✅ *ON*';
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

💡 *Tips:*
• .autotyping on/off
• .autoread on/off
• .autorecord on/off
• .autostatus on/off
• .chatbot on/off
• .antidelete on/off
• .antilink on/off

⚡ Powered by *MALAITECHX*`;

        await sock.sendMessage(chatId, {
            text: presenceText,
        }, { quoted: message });

    } catch (error) {
        console.error('Error in presenceCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch presence status.',
        }, { quoted: message });
    }
};

module.exports = presenceCommand;
