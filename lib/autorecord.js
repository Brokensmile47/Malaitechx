const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/autorecord.json');

// ensure config exists
function initConfig() {
    try {
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
        }
        return JSON.parse(fs.readFileSync(configPath));
    } catch (err) {
        console.error('Autorecord config error:', err);
        return { enabled: false };
    }
}

// toggle command
async function autorecordCommand(sock, chatId, message) {
    const config = initConfig();

    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    const args = text.trim().split(' ').slice(1);

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

    return await sock.sendMessage(chatId, {
        text: `🎙️ AutoRecord ${config.enabled ? 'enabled' : 'disabled'}`
    });
}

// status check
function isAutorecordEnabled() {
    return initConfig().enabled;
}

// presence handler (SAFE 20s recording)
async function handleAutorecord(sock, chatId) {
    if (!isAutorecordEnabled()) return false;

    try {
        await sock.presenceSubscribe(chatId);

        // recording indicator
        await sock.sendPresenceUpdate('recording', chatId);

        // 20 second fake recording
        await new Promise(resolve => setTimeout(resolve, 20000));

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
