/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Settings Command
 * Shows all bot toggles with their current on/off status
 */

const fs   = require('fs');
const path = require('path');
const { badge, footer, getContextInfo } = require('./darkTheme');

const DATA = path.join(process.cwd(), 'data');

const channelLink = () => global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p';

const contextInfo = {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '0029Vb7yILLBadmWeKQso40p@newsletter',
        newsletterName: '✨ Made By Kɪᴍᴀɴɪ Samuel 💎',
        serverMessageId: -1
    },
    externalAdReply: {
        title: '🦈 MALAITECHX',
        body: 'Made By Kimani Samuel',
        sourceUrl: 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p',
        mediaType: 1,
        renderLargerThumbnail: false
    }
};

// Read a JSON config file safely
function readConfig(filename) {
    try {
        const p = path.join(DATA, filename);
        if (!fs.existsSync(p)) return {};
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (_) { return {}; }
}

// Status emoji
function status(val) { return badge(val); }

async function settingsCommand(sock, chatId, message) {
    try {
        // Read all feature configs
        const autotyping  = readConfig('autotyping.json');
        const autoread    = readConfig('autoread.json');
        const autorecord  = readConfig('autorecord.json');
        const autostatus  = readConfig('autostatus.json');
        const areact      = readConfig('areact.json');
        const antidelete  = readConfig('antidelete.json');
        const antilink    = readConfig('antilink.json');
        const antibadword = readConfig('antibadword.json');
        const antitag     = readConfig('antitag.json');
        const anticall    = readConfig('anticall.json');
        const pmblocker   = readConfig('pmblocker.json');
        const chatbot     = readConfig('chatbot.json');
        const welcome     = readConfig('welcome.json');
        const goodbye     = readConfig('goodbye.json');
        const bio         = readConfig('bio.json');
        const mode        = readConfig('messageCount.json');
        const mention     = readConfig('mention.json');

        const isPublic = typeof mode.isPublic === 'boolean' ? mode.isPublic : true;

        const msg =
`╔═══════════════════════╗
┃  ⚙️ *MALAITECHX SETTINGS*
╚═══════════════════════╝

┌──────────────────❖
│ 🌐 *BOT MODE*
├──────────────────❖
│ 🔓 Mode        : *${isPublic ? '🌍 Public' : '🔒 Private'}*
└──────────────────❖

┌──────────────────❖
│ 🤖 *AUTO FEATURES*
├──────────────────❖
│ ⌨️  AutoTyping  : *${status(autotyping.enabled)}*
│ 👁️  AutoRead    : *${status(autoread.enabled)}*
│ 🎙️  AutoRecord  : *${status(autorecord.enabled)}*
│ 📊 AutoStatus  : *${status(autostatus.enabled)}*
│ 🎭 AutoReact   : *${status(areact.enabled)}*
│ 🛡️  Auto Bio    : *${status(bio.enabled)}*
└──────────────────❖

┌──────────────────❖
│ 🛡️ *PROTECTION*
├──────────────────❖
│ 🗑️  AntiDelete  : *${status(antidelete.enabled)}*
│ 🔗 AntiLink    : *${status(antilink.enabled)}*
│ 🤐 AntiBadWord : *${status(antibadword.enabled)}*
│ 🏷️  AntiTag     : *${status(antitag.enabled)}*
│ 📵 AntiCall    : *${status(anticall.enabled)}*
│ 🚫 PM Blocker  : *${status(pmblocker.enabled)}*
└──────────────────❖

┌──────────────────❖
│ 💬 *GROUP FEATURES*
├──────────────────❖
│ 🤖 Chatbot     : *${status(chatbot.enabled)}*
│ 👋 Welcome     : *${status(welcome.enabled)}*
│ 👋 Goodbye     : *${status(goodbye.enabled)}*
│ 📢 Mention     : *${status(mention.enabled)}*
└──────────────────❖

┌──────────────────❖
│ 🔧 *TOGGLE COMMANDS*
├──────────────────❖
│ ➤ .autotyping on/off
│ ➤ .autoread on/off
│ ➤ .autorecord on/off
│ ➤ .autostatus on/off
│ ➤ .autoreact on/off
│ ➤ .bio on/off
│ ➤ .antidelete on/off
│ ➤ .antilink on/off
│ ➤ .antibadword on/off
│ ➤ .antitag on/off
│ ➤ .anticall on/off
│ ➤ .pmblocker on/off
│ ➤ .chatbot on/off
│ ➤ .welcome on/off
│ ➤ .goodbye on/off
│ ➤ .mode public/private
└──────────────────❖

*Made By Kimani Samuel*
📢 ${channelLink()}`;

        await sock.sendMessage(chatId, {
            text: msg,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('settings error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to load settings.',
            contextInfo
        }, { quoted: message });
    }
}

module.exports = settingsCommand;
