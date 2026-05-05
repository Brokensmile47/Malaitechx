/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Bio Command
 * Auto-updates bot's WhatsApp about/status with live date & time every minute
 */

const fs   = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'data', 'bio.json');

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

// ─── Config helpers ───────────────────────────────────────────────────────────
function getConfig() {
    try {
        if (!fs.existsSync(configPath)) return { enabled: false };
        return JSON.parse(fs.readFileSync(configPath));
    } catch (_) { return { enabled: false }; }
}

function saveConfig(cfg) {
    try {
        fs.mkdirSync(path.dirname(configPath), { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
    } catch (_) {}
}

// ─── Build the status string ──────────────────────────────────────────────────
function buildBio() {
    const now = new Date();
    const day   = now.getDate();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();
    let hours   = now.getHours();
    const mins  = now.getMinutes().toString().padStart(2, '0');
    const ampm  = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `🛡️ Malai XD is Active 🤖\n📅 ${day}/${month}/${year}\n⏰ ${hours}:${mins} ${ampm}`;
}

// ─── Interval reference ───────────────────────────────────────────────────────
let bioInterval = null;

async function startBioUpdater(sock) {
    if (!getConfig().enabled) return;

    // Update immediately on start
    try { await sock.updateProfileStatus(buildBio()); } catch (_) {}

    // Clear any old interval
    if (bioInterval) clearInterval(bioInterval);

    // Update every 60 seconds
    bioInterval = setInterval(async () => {
        if (!getConfig().enabled) {
            clearInterval(bioInterval);
            bioInterval = null;
            return;
        }
        try { await sock.updateProfileStatus(buildBio()); } catch (_) {}
    }, 60 * 1000);
}

function stopBioUpdater() {
    if (bioInterval) { clearInterval(bioInterval); bioInterval = null; }
}

// ─── Command handler ──────────────────────────────────────────────────────────
async function bioCommand(sock, chatId, message) {
    try {
        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || '';
        const arg = text.trim().split(' ')[1]?.toLowerCase();

        const cfg = getConfig();

        if (arg === 'on' || arg === 'enable') {
            cfg.enabled = true;
        } else if (arg === 'off' || arg === 'disable') {
            cfg.enabled = false;
        } else if (!arg) {
            cfg.enabled = !cfg.enabled;
        } else {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: *.bio on* or *.bio off*',
                ...channelInfo
            }, { quoted: message });
        }

        saveConfig(cfg);

        if (cfg.enabled) {
            await startBioUpdater(sock);
            return sock.sendMessage(chatId, {
                text: `✅ *Auto-Bio Enabled!*\n\nYour WhatsApp status will update every minute:\n\n_${buildBio()}_`,
                ...channelInfo
            }, { quoted: message });
        } else {
            stopBioUpdater();
            return sock.sendMessage(chatId, {
                text: `❌ *Auto-Bio Disabled.*\nYour status will no longer update automatically.`,
                ...channelInfo
            }, { quoted: message });
        }

    } catch (err) {
        console.error('bio error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to toggle auto-bio.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = { bioCommand, startBioUpdater, stopBioUpdater };
