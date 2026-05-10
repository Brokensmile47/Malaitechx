/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Welcome Command
 * Greets new members with group DP, details and member mention
 */

const fs   = require('fs');
const path = require('path');
const axios = require('axios');

const CONFIG_DIR  = path.join(__dirname, '..', 'data', 'welcome');
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

function ensureDir() {
    if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

function getConfig(groupId) {
    ensureDir();
    const file = path.join(CONFIG_DIR, `${groupId}.json`);
    if (!fs.existsSync(file)) return { enabled: false, message: '' };
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return { enabled: false, message: '' }; }
}

function saveConfig(groupId, config) {
    ensureDir();
    fs.writeFileSync(path.join(CONFIG_DIR, `${groupId}.json`), JSON.stringify(config, null, 2));
}

// ── Toggle command ────────────────────────────────────────────────────────────
async function welcomeCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: '❌ This command only works in groups.', ...channelInfo }, { quoted: message });
    }

    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(' ').slice(1);
    const action = args[0]?.toLowerCase();

    const config = getConfig(chatId);

    if (action === 'on' || action === 'enable') {
        config.enabled = true;
        saveConfig(chatId, config);
        return sock.sendMessage(chatId, {
            text: '✅ *Welcome messages enabled!*\n\nNew members will be greeted with group details and DP.',
            ...channelInfo
        }, { quoted: message });
    }

    if (action === 'off' || action === 'disable') {
        config.enabled = false;
        saveConfig(chatId, config);
        return sock.sendMessage(chatId, {
            text: '❌ *Welcome messages disabled.*',
            ...channelInfo
        }, { quoted: message });
    }

    if (action === 'setmsg') {
        const customMsg = args.slice(1).join(' ');
        if (!customMsg) {
            return sock.sendMessage(chatId, {
                text: '❌ Provide a message. Variables: {user} {group} {desc} {count}\nExample: *.welcome setmsg Welcome {user} to {group}!*',
                ...channelInfo
            }, { quoted: message });
        }
        config.message = customMsg;
        saveConfig(chatId, config);
        return sock.sendMessage(chatId, { text: '✅ Custom welcome message saved!', ...channelInfo }, { quoted: message });
    }

    // Status
    return sock.sendMessage(chatId, {
        text: `🎉 *Welcome Status*\n\n` +
              `Status  : *${config.enabled ? '✅ ON' : '❌ OFF'}*\n` +
              `Message : *${config.message || 'Default'}*\n\n` +
              `Commands:\n` +
              `• *.welcome on* — enable\n` +
              `• *.welcome off* — disable\n` +
              `• *.welcome setmsg <text>* — custom message`,
        ...channelInfo
    }, { quoted: message });
}

// ── Handle new member joining ─────────────────────────────────────────────────
async function handleJoinEvent(sock, groupId, participants) {
    const config = getConfig(groupId);
    if (!config.enabled) return;

    let meta;
    try { meta = await sock.groupMetadata(groupId); } catch (_) { return; }

    const groupName  = meta.subject || 'Group';
    const groupDesc  = meta.desc || 'No description';
    const memberCount = meta.participants?.length || 0;

    // Get group DP
    let groupDp = null;
    try {
        const dpUrl = await sock.profilePictureUrl(groupId, 'image');
        if (dpUrl) {
            const res = await axios.get(dpUrl, { responseType: 'arraybuffer', timeout: 10000 });
            groupDp = Buffer.from(res.data);
        }
    } catch (_) {}

    for (const participant of participants) {
        const jid    = typeof participant === 'string' ? participant : (participant.id || String(participant));
        const number = jid.split('@')[0];

        // Build greeting
        let greeting = config.message
            ? config.message
                .replace(/{user}/gi, `@${number}`)
                .replace(/{group}/gi, groupName)
                .replace(/{desc}/gi, groupDesc)
                .replace(/{count}/gi, memberCount)
            : null;

        if (!greeting) {
            greeting =
`╭━━━━━━━━━━━━━━━━━━━━╮
┃   🎉 *NEW MEMBER* 🎉
╰━━━━━━━━━━━━━━━━━━━━╯

👋 Welcome @${number}!

╭━━━━━━━━━━━━━━━━━━━━╮
┃ 📛 *Group:* ${groupName}
┃ 👥 *Members:* ${memberCount}
┃ 📝 *About:*
┃ ${groupDesc.slice(0, 100)}${groupDesc.length > 100 ? '...' : ''}
╰━━━━━━━━━━━━━━━━━━━━╯

We're glad to have you here! 🦈
Please read the group rules.

*Made By Kimani Samuel*`;
        }

        try {
            if (groupDp) {
                await sock.sendMessage(groupId, {
                    image: groupDp,
                    caption: greeting,
                    mentions: [jid],
                    ...channelInfo
                });
            } else {
                await sock.sendMessage(groupId, {
                    text: greeting,
                    mentions: [jid],
                    ...channelInfo
                });
            }
        } catch (e) {
            console.error('Welcome error:', e.message);
        }
    }
}

module.exports = { welcomeCommand, handleJoinEvent };
