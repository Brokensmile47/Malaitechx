/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Autorecord (Autotyping-style system)
 * Shows fake "recording..." presence for WhatsApp bot
 */

const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

// Config path
const configPath = path.join(__dirname, '..', 'data', 'autorecord.json');

// Initialize config
function initConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
    }
    return JSON.parse(fs.readFileSync(configPath));
}

/**
 * Toggle autorecord command
 */
async function autorecordCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!message.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, {
                text: '❌ This command is only available for the owner!'
            });
            return;
        }

        const args =
            message.message?.conversation?.trim().split(' ').slice(1) ||
            message.message?.extendedTextMessage?.text?.trim().split(' ').slice(1) ||
            [];

        const config = initConfig();

        if (args.length > 0) {
            const action = args[0].toLowerCase();

            if (action === 'on' || action === 'enable') {
                config.enabled = true;
            } else if (action === 'off' || action === 'disable') {
                config.enabled = false;
            } else {
                await sock.sendMessage(chatId, {
                    text: '❌ Invalid option! Use: .autorecord on/off'
                });
                return;
            }
        } else {
            config.enabled = !config.enabled;
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(chatId, {
            text: `🎙️ Auto-record has been ${config.enabled ? 'enabled' : 'disabled'}!`
        });

    } catch (error) {
        console.error('Error in autorecord command:', error);
    }
}

/**
 * Check if enabled
 */
function isAutorecordEnabled() {
    try {
        return initConfig().enabled;
    } catch {
        return false;
    }
}

/**
 * 🔥 FIXED AUTORECORD HANDLER (ONLY PATCHED PART)
 */
async function handleAutorecord(sock, chatId) {
    if (!isAutorecordEnabled()) return false;

    try {
        // 🔥 FIX 1: safe subscribe (prevents silent crash)
        try {
            await sock.presenceSubscribe(chatId);
        } catch (_) {}

        // 🔥 FIX 2: ensure presence actually triggers
        await sock.sendPresenceUpdate('recording', chatId);

        // keep it alive briefly (WhatsApp needs time to render)
        await new Promise(r => setTimeout(r, 1500));

        return true;

    } catch (error) {
        console.error('Autorecord error:', error);
        return false;
    }
}

module.exports = {
    autorecordCommand,
    isAutorecordEnabled,
    handleAutorecord
};
