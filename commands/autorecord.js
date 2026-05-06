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
                text: '❌ This command is only available for the owner!',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
                        newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
                        serverMessageId: -1
                    }
                }
            });
            return;
        }

        const args =
            message.message?.conversation?.trim().split(' ').slice(1) ||
            message.message?.extendedTextMessage?.text?.trim().split(' ').slice(1) ||
            [];

        const config = initConfig();

        // Toggle logic (same style as autotyping)
        if (args.length > 0) {
            const action = args[0].toLowerCase();

            if (action === 'on' || action === 'enable') {
                config.enabled = true;
            } else if (action === 'off' || action === 'disable') {
                config.enabled = false;
            } else {
                await sock.sendMessage(chatId, {
                    text: '❌ Invalid option! Use: .autorecord on/off',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
                            newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
                            serverMessageId: -1
                        }
                    }
                });
                return;
            }
        } else {
            config.enabled = !config.enabled;
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(chatId, {
            text: `🎙️ Auto-record has been ${config.enabled ? 'enabled' : 'disabled'}!`,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
                    newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
                    serverMessageId: -1
                }
            }
        });

    } catch (error) {
        console.error('Error in autorecord command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing autorecord command!',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
                    newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
                    serverMessageId: -1
                }
            }
        });
    }
}

/**
 * Check if enabled
 */
function isAutorecordEnabled() {
    try {
        const config = initConfig();
        return config.enabled;
    } catch (error) {
        console.error('Error checking autorecord:', error);
        return false;
    }
}

/**
 * Fake recording presence (20 seconds like autotyping style delay system)
 */
async function handleAutorecord(sock, chatId) {
    // Guard: only run when fully connected
    if (!global.isConnected) return false;
    if (!isAutorecordEnabled()) return false;

    try {
        // Subscribe first
        if (!global.isConnected) return false;
        await sock.presenceSubscribe(chatId);

        // Start recording indicator
        if (!global.isConnected) return false;
        await sock.sendPresenceUpdate('recording', chatId);

        // Wait in small chunks — check connection each time
        const chunks = 10; // 10 x 2s = 20s total
        for (let i = 0; i < chunks; i++) {
            await new Promise(r => setTimeout(r, 2000));
            if (!global.isConnected) return false; // bail if disconnected mid-wait
        }

        // Stop recording
        if (!global.isConnected) return false;
        await sock.sendPresenceUpdate('paused', chatId);

        return true;
    } catch (_) {
        // Silent — never crash the bot over presence errors
        return false;
    }
}

module.exports = {
    autorecordCommand,
    isAutorecordEnabled,
    handleAutorecord
};
