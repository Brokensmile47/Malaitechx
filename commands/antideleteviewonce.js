/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Anti-Delete ViewOnce
 * Detects deleted view-once messages and forwards to owner's Message Yourself
 */

const fs   = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const CONFIG_PATH    = path.join(__dirname, '..', 'data', 'antideleteviewonce.json');
const viewOnceStore  = new Map();

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
            newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
            serverMessageId: -1
        }
    }
};

function getConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (_) { return { enabled: false }; }
}

function saveConfig(cfg) {
    try {
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
    } catch (_) {}
}

// ── Command ───────────────────────────────────────────────────────────────────
async function antideleteViewOnceCommand(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const arg  = text.trim().split(' ')[1]?.toLowerCase();
    const cfg  = getConfig();

    if (arg === 'on' || arg === 'enable')       cfg.enabled = true;
    else if (arg === 'off' || arg === 'disable') cfg.enabled = false;
    else cfg.enabled = !cfg.enabled;

    saveConfig(cfg);
    await sock.sendMessage(chatId, {
        text: `👁️ *Anti-Delete ViewOnce:* ${cfg.enabled ? '✅ ON' : '❌ OFF'}\n\n${cfg.enabled ? 'Deleted view-once messages will be forwarded to your Message Yourself.' : ''}`,
        ...channelInfo
    }, { quoted: message });
}

// ── Store view-once messages when received ────────────────────────────────────
function storeViewOnce(message) {
    if (!getConfig().enabled) return;
    try {
        const inner = message.message;
        const isViewOnce = !!(
            inner?.viewOnceMessage ||
            inner?.viewOnceMessageV2 ||
            inner?.viewOnceMessageV2Extension
        );
        if (!isViewOnce) return;

        const key = message.key?.id;
        if (!key) return;

        viewOnceStore.set(key, {
            message,
            sender: message.key?.participant || message.key?.remoteJid,
            chatId: message.key?.remoteJid,
            timestamp: Date.now()
        });

        // Clean old entries
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        for (const [k, v] of viewOnceStore.entries()) {
            if (v.timestamp < cutoff) viewOnceStore.delete(k);
        }
    } catch (_) {}
}

// ── Handle deleted view-once ──────────────────────────────────────────────────
async function handleDeletedViewOnce(sock, deletedKey) {
    if (!getConfig().enabled) return;
    const stored = viewOnceStore.get(deletedKey.id);
    if (!stored) return;

    try {
        const selfJid   = sock.user?.id?.replace(/:\d+/, '') + '@s.whatsapp.net';
        const senderNum = (stored.sender || 'unknown').split('@')[0];
        const msg       = stored.message;
        const inner     = msg.message;

        // Unwrap view-once
        const viewOnceContent =
            inner?.viewOnceMessage?.message ||
            inner?.viewOnceMessageV2?.message ||
            inner?.viewOnceMessageV2Extension?.message ||
            inner;

        const caption =
`👁️ *Deleted View-Once Detected!*
👤 From: +${senderNum}
💬 Chat: ${stored.chatId?.endsWith('@g.us') ? 'Group' : 'Private'}
⏰ At: ${new Date().toLocaleString()}

*Made By Kimani Samuel*`;

        const silentLogger = {
            info:()=>{}, error:()=>{}, warn:()=>{}, debug:()=>{},
            child:()=>({ info:()=>{}, error:()=>{}, warn:()=>{}, debug:()=>{} })
        };

        if (viewOnceContent?.imageMessage) {
            const buf = await downloadMediaMessage(
                { key: msg.key, message: { imageMessage: viewOnceContent.imageMessage } },
                'buffer', {},
                { logger: silentLogger, reuploadRequest: sock.updateMediaMessage }
            );
            await sock.sendMessage(selfJid, { image: buf, caption, ...channelInfo });
        } else if (viewOnceContent?.videoMessage) {
            const buf = await downloadMediaMessage(
                { key: msg.key, message: { videoMessage: viewOnceContent.videoMessage } },
                'buffer', {},
                { logger: silentLogger, reuploadRequest: sock.updateMediaMessage }
            );
            await sock.sendMessage(selfJid, { video: buf, caption, ...channelInfo });
        } else if (viewOnceContent?.audioMessage) {
            const buf = await downloadMediaMessage(
                { key: msg.key, message: { audioMessage: viewOnceContent.audioMessage } },
                'buffer', {},
                { logger: silentLogger, reuploadRequest: sock.updateMediaMessage }
            );
            await sock.sendMessage(selfJid, { audio: buf, mimetype: 'audio/mp4', caption, ...channelInfo });
        } else {
            await sock.sendMessage(selfJid, { text: caption, ...channelInfo });
        }
    } catch (e) {
        console.error('antideleteviewonce error:', e.message);
    }
}

module.exports = { antideleteViewOnceCommand, storeViewOnce, handleDeletedViewOnce };
