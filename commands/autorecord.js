/**
 * Malai XD - Autorecord (Autotyping-style system)
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
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'Malai XD',
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
                            newsletterJid: '120363161513685998@newsletter',
                            newsletterName: 'Malai XD',
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
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'Malai XD',
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
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'Malai XD',
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
    if (isAutorecordEnabled()) {
        try {
            // Subscribe to presence
            await sock.presenceSubscribe(chatId);

            // Start recording
            await sock.sendPresenceUpdate('recording', chatId);

            // Human-like delay (20 seconds total)
            const recordDelay = 20000;
            await new Promise(resolve => setTimeout(resolve, recordDelay));

            // Refresh recording status (keeps it alive visually)
            await sock.sendPresenceUpdate('recording', chatId);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Stop recording
            await sock.sendPresenceUpdate('paused', chatId);

            return true;
        } catch (error) {
            console.error('❌ Error in autorecord presence:', error);
            return false;
        }
    }
    return false;
}

module.exports = {
    autorecordCommand,
    isAutorecordEnabled,
    handleAutorecord
};
