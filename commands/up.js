/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - .up Command
 * Shows group message ranking from least to most talkative
 */

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'messageCount.json');

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

function loadCounts() {
    try {
        if (!fs.existsSync(DATA_FILE)) return {};
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (_) { return {}; }
}

const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

async function upCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: '❌ This command only works in groups.',
                ...channelInfo
            }, { quoted: message });
        }

        const counts   = loadCounts();
        const groupData = counts[chatId] || {};
        const entries  = Object.entries(groupData);

        if (entries.length === 0) {
            return sock.sendMessage(chatId, {
                text: '📊 No message activity recorded yet in this group.\n\nThe bot starts tracking messages after it joins.',
                ...channelInfo
            }, { quoted: message });
        }

        // Sort from LEAST to MOST talkative
        const sorted = entries
            .filter(([jid, count]) => jid && count > 0)
            .sort(([, a], [, b]) => a - b); // ascending = least first

        // Get group metadata to get member names
        let meta = null;
        try { meta = await sock.groupMetadata(chatId); } catch (_) {}

        const getDisplayName = (jid) => {
            const num = jid.split('@')[0];
            if (meta) {
                const p = meta.participants?.find(p => p.id === jid);
                if (p?.name) return p.name;
            }
            return `+${num}`;
        };

        const total = entries.reduce((sum, [, c]) => sum + c, 0);
        const topN  = Math.min(sorted.length, 10);

        // Show from least to most (reverse for display — most at bottom = "top")
        const displayList = sorted.slice(-topN).reverse(); // top 10, most talkative last

        let txt = `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        txt    += `┃  📊 *GROUP RANKING*\n`;
        txt    += `┃  📱 ${meta?.subject || 'Group'}\n`;
        txt    += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        txt    += `*🏆 Most Talkative → Least:*\n`;
        txt    += `━━━━━━━━━━━━━━━━━━━━\n`;

        const mentions = [];
        displayList.forEach(([jid, count], i) => {
            const rank    = i + 1;
            const medal   = medals[i] || `${rank}.`;
            const name    = getDisplayName(jid);
            const pct     = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
            const bar     = '█'.repeat(Math.round(count / Math.max(...displayList.map(([,c])=>c)) * 8)) || '░';

            txt += `${medal} @${jid.split('@')[0]}\n`;
            txt += `   💬 ${count} msgs | 📊 ${pct}% | ${bar}\n`;
            mentions.push(jid);
        });

        txt += `━━━━━━━━━━━━━━━━━━━━\n`;
        txt += `👥 *Total members tracked:* ${entries.length}\n`;
        txt += `💬 *Total messages:* ${total.toLocaleString()}\n\n`;
        txt += `*Made By Kimani Samuel*\n`;
        txt += `📢 ${global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p'}`;

        await sock.sendMessage(chatId, {
            text: txt,
            mentions,
            ...channelInfo
        }, { quoted: message });

    } catch (err) {
        console.error('up command error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to load ranking.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = upCommand;
