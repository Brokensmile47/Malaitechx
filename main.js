// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

// ⭐ ADD THIS HELPER FUNCTION
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const {
    autotypingCommand,
    isAutotypingEnabled,
    handleAutotypingForMessage,
    handleAutotypingForCommand,
    showTypingAfterCommand
} = require('./commands/autotyping');

const {
    autoreadCommand,
    isAutoreadEnabled,
    handleAutoread
} = require('./commands/autoread');

/* ⭐ ADDED AUTORECORD */
const {
    handleAutorecord
} = require('./commands/autorecord');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
// ... (UNCHANGED EVERYTHING ELSE)

// ⭐ FIX: Add presence update to show bot is active
if (!message.key.fromMe) {
    try {
        await sock.sendPresenceUpdate('available', chatId);
    } catch (e) { }
}

/* ⭐ AUTORECORD ADDED HERE (same style as autotyping) */
await handleAutorecord(sock, chatId);

// Handle button responses
if (message.message?.buttonsResponseMessage) {
    const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
    const chatId = message.key.remoteJid;

    if (buttonId === 'channel') {
        await sock.sendMessage(chatId, {
            // unchanged
        }, { quoted: message });
        return;
    }
}

// ... EVERYTHING ELSE UNCHANGED

// THEN your existing autotyping
if (!userMessage.startsWith('.')) {
    await handleAutotypingForMessage(sock, chatId, userMessage);

    if (isGroup) {
        await handleTagDetection(sock, chatId, message, senderId);
        await handleMentionDetection(sock, chatId, message);

        if (isPublic || isOwnerOrSudoCheck) {
            await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
        }
    }
    return;
}

// COMMAND EXECUTION FLOW (UNCHANGED)
// ...
