const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const messageStore = new Map();
const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

// Ensure tmp dir exists
if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

// Folder size check
const getFolderSizeInMB = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let totalSize = 0;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
            }
        }

        return totalSize / (1024 * 1024);
    } catch (err) {
        console.error('Error getting folder size:', err);
        return 0;
    }
};

// Cleanup temp folder
const cleanTempFolderIfLarge = () => {
    try {
        const sizeMB = getFolderSizeInMB(TEMP_MEDIA_DIR);

        if (sizeMB > 200) {
            const files = fs.readdirSync(TEMP_MEDIA_DIR);
            for (const file of files) {
                const filePath = path.join(TEMP_MEDIA_DIR, file);
                fs.unlinkSync(filePath);
            }
        }
    } catch (err) {
        console.error('Temp cleanup error:', err);
    }
};

setInterval(cleanTempFolderIfLarge, 60 * 1000);

// Load config
function loadAntideleteConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
        return JSON.parse(fs.readFileSync(CONFIG_PATH));
    } catch {
        return { enabled: false };
    }
}

// Save config
function saveAntideleteConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (err) {
        console.error('Config save error:', err);
    }
}

const isOwnerOrSudo = require('../lib/isOwner');

// Command handler
async function handleAntideleteCommand(sock, chatId, message, match) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

    if (!message.key.fromMe && !isOwner) {
        return sock.sendMessage(chatId, { text: '*Only the bot owner can use this command.*' }, { quoted: message });
    }

    const config = loadAntideleteConfig();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `*ANTIDELETE SETUP*\n\nCurrent Status: ${config.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n*.antidelete on* - Enable\n*.antidelete off* - Disable`
        }, { quoted: message });
    }

    if (match === 'on') config.enabled = true;
    else if (match === 'off') config.enabled = false;
    else {
        return sock.sendMessage(chatId, { text: '*Invalid command. Use .antidelete on/off*' }, { quoted: message });
    }

    saveAntideleteConfig(config);

    return sock.sendMessage(chatId, {
        text: `*Antidelete ${config.enabled ? 'enabled' : 'disabled'}*`
    }, { quoted: message });
}

// Store messages safely (FIXED CRASH HERE)
async function storeMessage(sock, message) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled) return;
        if (!message.key?.id) return;

        const messageId = message.key.id;

        let content = '';
        let mediaType = '';
        let mediaPath = '';
        let isViewOnce = false;

        const sender = message.key.participant || message.key.remoteJid;

        const viewOnceContainer =
            message.message?.viewOnceMessageV2?.message ||
            message.message?.viewOnceMessage?.message;

        // VIEW ONCE
        if (viewOnceContainer) {
            try {
                if (viewOnceContainer.imageMessage?.mediaKey) {
                    mediaType = 'image';
                    content = viewOnceContainer.imageMessage.caption || '';

                    const buffer = await downloadContentFromMessage(viewOnceContainer.imageMessage, 'image');

                    mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
                    await writeFile(mediaPath, buffer);
                    isViewOnce = true;
                }

                else if (viewOnceContainer.videoMessage?.mediaKey) {
                    mediaType = 'video';
                    content = viewOnceContainer.videoMessage.caption || '';

                    const buffer = await downloadContentFromMessage(viewOnceContainer.videoMessage, 'video');

                    mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
                    await writeFile(mediaPath, buffer);
                    isViewOnce = true;
                }
            } catch (e) {
                console.log('ViewOnce skip:', e.message);
            }
        }

        // TEXT
        else if (message.message?.conversation) {
            content = message.message.conversation;
        }

        else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        }

        // IMAGE (FIXED)
        else if (message.message?.imageMessage?.mediaKey) {
            try {
                mediaType = 'image';
                content = message.message.imageMessage.caption || '';

                const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');

                mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
                await writeFile(mediaPath, buffer);
            } catch (e) {
                console.log('Image skip:', e.message);
            }
        }

        // STICKER (FIXED)
        else if (message.message?.stickerMessage?.mediaKey) {
            try {
                mediaType = 'sticker';

                const buffer = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');

                mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
                await writeFile(mediaPath, buffer);
            } catch (e) {
                console.log('Sticker skip:', e.message);
            }
        }

        // VIDEO (FIXED)
        else if (message.message?.videoMessage?.mediaKey) {
            try {
                mediaType = 'video';
                content = message.message.videoMessage.caption || '';

                const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');

                mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
                await writeFile(mediaPath, buffer);
            } catch (e) {
                console.log('Video skip:', e.message);
            }
        }

        // AUDIO (FIXED)
        else if (message.message?.audioMessage?.mediaKey) {
            try {
                mediaType = 'audio';

                const mime = message.message.audioMessage.mimetype || '';
                const ext = mime.includes('ogg') ? 'ogg' : 'mp3';

                const buffer = await downloadContentFromMessage(message.message.audioMessage, 'audio');

                mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.${ext}`);
                await writeFile(mediaPath, buffer);
            } catch (e) {
                console.log('Audio skip:', e.message);
            }
        }

        messageStore.set(messageId, {
            content,
            mediaType,
            mediaPath,
            sender,
            group: message.key.remoteJid.endsWith('@g.us') ? message.key.remoteJid : null,
            timestamp: new Date().toISOString()
        });

        // ViewOnce forward
        if (isViewOnce && mediaPath && fs.existsSync(mediaPath)) {
            try {
                const ownerNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

                if (mediaType === 'image') {
                    await sock.sendMessage(ownerNumber, {
                        image: { url: mediaPath },
                        caption: 'ViewOnce Image'
                    });
                }

                if (mediaType === 'video') {
                    await sock.sendMessage(ownerNumber, {
                        video: { url: mediaPath },
                        caption: 'ViewOnce Video'
                    });
                }

                fs.unlinkSync(mediaPath);
            } catch (e) {}
        }

    } catch (err) {
        console.error('storeMessage error:', err);
    }
}

// Handle deletion
async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const config = loadAntideleteConfig();
        if (!config.enabled) return;

        const messageId = revocationMessage.message.protocolMessage.key.id;

        const deletedBy =
            revocationMessage.participant ||
            revocationMessage.key.participant ||
            revocationMessage.key.remoteJid;

        const ownerNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

        if (deletedBy.includes(sock.user.id)) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const sender = original.sender;

        let text =
`*🔰 ANTIDELETE REPORT 🔰*

🗑️ Deleted By: @${deletedBy.split('@')[0]}
👤 Sender: @${sender.split('@')[0]}
📱 Number: ${sender}
💬 Message: ${original.content || 'Media'}`;

        await sock.sendMessage(ownerNumber, {
            text,
            mentions: [deletedBy, sender]
        });

        if (original.mediaPath && fs.existsSync(original.mediaPath)) {
            try {
                await sock.sendMessage(ownerNumber, {
                    [original.mediaType]: { url: original.mediaPath },
                    caption: 'Deleted Media'
                });

                fs.unlinkSync(original.mediaPath);
            } catch (e) {
                console.log('Media send error:', e.message);
            }
        }

        messageStore.delete(messageId);

    } catch (err) {
        console.error('handleMessageRevocation error:', err);
    }
}

module.exports = {
    handleAntideleteCommand,
    handleMessageRevocation,
    storeMessage
};
