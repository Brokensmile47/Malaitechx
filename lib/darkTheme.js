/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Dark Theme Formatter
 * Gives all bot messages a consistent dark aesthetic
 */

const channelLink = () => global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p';

// ── Dark border styles ────────────────────────────────────────────────────────
const D = {
    top:    '╔══════════════════════╗',
    mid:    '╠══════════════════════╣',
    bot:    '╚══════════════════════╝',
    line:   '┃',
    thin:   '┌──────────────────────┐',
    thinM:  '├──────────────────────┤',
    thinB:  '└──────────────────────┘',
    divider:'▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    dot:    '◆',
    arrow:  '▸',
};

// ── Context info (channel forwarding tag) ─────────────────────────────────────
const getContextInfo = (withButton = false) => {
    const base = {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
            newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
            serverMessageId: -1
        }
    };
    if (withButton) {
        base.externalAdReply = {
            title: '🦈 MALAITECHX',
            body: 'Made By Kimani Samuel — Tap to View Channel',
            sourceUrl: channelLink(),
            mediaType: 1,
            renderLargerThumbnail: false
        };
    }
    return base;
};

// ── Wrap a message in a dark card ─────────────────────────────────────────────
function darkCard(title, lines, emoji = '🦈') {
    let msg = `${D.top}\n`;
    msg    += `${D.line}  ${emoji} *${title.toUpperCase()}*\n`;
    msg    += `${D.mid}\n`;
    for (const line of lines) {
        msg += `${D.line} ${line}\n`;
    }
    msg    += `${D.bot}\n\n`;
    msg    += `*Made By Kimani Samuel*\n📢 ${channelLink()}`;
    return msg;
}

// ── Section header ────────────────────────────────────────────────────────────
function section(title, emoji = '◆') {
    return `\n${D.thin}\n│ ${emoji} *${title}*\n${D.thinB}`;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function badge(val) {
    return val ? '🟢 *ON*' : '🔴 *OFF*';
}

// ── Footer ────────────────────────────────────────────────────────────────────
function footer() {
    return `\n${D.divider}\n*Made By Kimani Samuel*\n📢 ${channelLink()}`;
}

// ── Standard channelInfo for all messages ─────────────────────────────────────
const channelInfo = {
    contextInfo: getContextInfo(false)
};

// channelInfo with view channel button
const channelInfoWithButton = {
    contextInfo: getContextInfo(true)
};

module.exports = {
    D,
    darkCard,
    section,
    badge,
    footer,
    channelInfo,
    channelInfoWithButton,
    getContextInfo
};
