/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Anti-Delete Status
 * Detects deleted WhatsApp statuses and forwards to owner's Message Yourself
 */

const fs   = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const CONFIG_PATH  = path.join(__dirname, '..', 'data', 'antistatus.json');
const statusStore  = new Map(); // Store status messages temporarily

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
async function antistatusCommand(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const arg  = text.trim().split(' ')[1]?.toLowerCase();
    const cfg  = getConfig();

    if (arg === 'on' || arg === 'enable')   cfg.enabled = true;
    else if (arg === 'off' || arg === 'disable') cfg.enabled = false;
    else cfg.enabled = !cfg.enabled;

    saveConfig(cfg);
    await sock.sendMessage(chatId, {
        text: `🛡️ *Anti-Delete Status:* ${cfg.enabled ? '✅ ON' : '❌ OFF'}\n\n${cfg.enabled ? 'Deleted statuses will be forwarded to your Message Yourself.' : ''}`,
        ...channelInfo
    }, { quoted: message });
}

// ── Store incoming status messages ────────────────────────────────────────────
function storeStatus(message) {
    if (!getConfig().enabled) return;
    try {
        const key = message.key?.id;
        if (!key) return;
        statusStore.set(key, {
            message,
            sender: message.key?.participant || message.key?.remoteJid,
            timestamp: Date.now()
        });
        // Keep store clean — remove entries older than 24h
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        for (const [k, v] of statusStore.entries()) {
            if (v.timestamp < cutoff) statusStore.delete(k);
        }
    } catch (_) {}
}

// ── Handle deleted status ─────────────────────────────────────────────────────
async function handleDeletedStatus(sock, deletedKey) {
    if (!getConfig().enabled) return;
    const stored = statusStore.get(deletedKey.id);
    if (!stored) return;

    try {
        const selfJid = sock.user?.id?.replace(/:\d+/, '') + '@s.whatsapp.net';
        const senderNum = (stored.sender || 'unknown').split('@')[0];
        const msg = stored.message;
        const inner = msg.message;

        const caption =
`🗑️ *Deleted Status Detected!*
👤 From: +${senderNum}
⏰ At: ${new Date().toLocaleString()}

*Made By Kimani Samuel*`;

        if (inner?.imageMessage) {
            const buf = await downloadMediaMessage(msg, 'buffer', {}, {
                logger: { info:()=>{}, error:()=>{}, warn:()=>{}, debug:()=>{}, child:()=>({info:()=>{},error:()=>{},warn:()=>{},debug:()=>{}}) },
                reuploadRequest: sock.updateMediaMessage
            });
            await sock.sendMessage(selfJid, { image: buf, caption, ...channelInfo });
        } else if (inner?.videoMessage) {
            const buf = await downloadMediaMessage(msg, 'buffer', {}, {
                logger: { info:()=>{}, error:()=>{}, warn:()=>{}, debug:()=>{}, child:()=>({info:()=>{},error:()=>{},warn:()=>{},debug:()=>{}}) },
                reuploadRequest: sock.updateMediaMessage
            });
            await sock.sendMessage(selfJid, { video: buf, caption, ...channelInfo });
        } else if (inner?.conversation || inner?.extendedTextMessage) {
            const text = inner.conversation || inner.extendedTextMessage?.text || '';
            await sock.sendMessage(selfJid, {
                text: `${caption}\n\n💬 *Content:*\n${text}`,
                ...channelInfo
            });
        } else {
            await sock.sendMessage(selfJid, { text: caption, ...channelInfo });
        }
    } catch (e) {
        console.error('antistatus forward error:', e.message);
    }
}

module.exports = { antistatusCommand, storeStatus, handleDeletedStatus };
