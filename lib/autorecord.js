const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/autorecord.json');

// init config
function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
    }
    return JSON.parse(fs.readFileSync(configPath));
}

// toggle command helper
async function autorecordCommand(sock, chatId, message) {
    const config = initConfig();

    const args =
        message.message?.conversation?.trim().split(' ').slice(1) ||
        message.message?.extendedTextMessage?.text?.trim().split(' ').slice(1) ||
        [];

    if (args.length > 0) {
        const action = args[0].toLowerCase();
        if (action === 'on' || action === 'enable') config.enabled = true;
        else if (action === 'off' || action === 'disable') config.enabled = false;
        else {
            return await sock.sendMessage(chatId, {
                text: '❌ Use: .autorecord on/off'
            });
        }
    } else {
        config.enabled = !config.enabled;
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await sock.sendMessage(chatId, {
        text: `🎙️ AutoRecord ${config.enabled ? 'enabled' : 'disabled'}`
    });
}

// check status
function isAutorecordEnabled() {
    try {
        return initConfig().enabled;
    } catch {
        return false;
    }
}

// MAIN FUNCTION (like antilink)
async function handleAutorecord(sock, chatId) {
    if (!isAutorecordEnabled()) return;

    try {
        await sock.presenceSubscribe(chatId);

        // show "recording"
        await sock.sendPresenceUpdate('recording', chatId);

        // 🔥 requested 20 seconds
        await new Promise(res => setTimeout(res, 20000));

        await sock.sendPresenceUpdate('paused', chatId);

        return true;
    } catch (err) {
        console.error('Autorecord error:', err);
        return false;
    }
}

module.exports = {
    autorecordCommand,
    isAutorecordEnabled,
    handleAutorecord
};
