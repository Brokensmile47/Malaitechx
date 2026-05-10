/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - GitHub / Repo Command
 */

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

async function githubCommand(sock, chatId, message) {
    const text =
`╭━━━━━━━━━━━━━━━━━━━━━╮
┃     🦈 *MALAI XD BOT*
╰━━━━━━━━━━━━━━━━━━━━━╯

👑 *Owner :* Kɪᴍᴀɴɪ Samuel

💻 *Source Code / Repo:*
https://github.com/Brokensmile47/Malaitechx.git

📦 *Clone with:*
\`git clone https://github.com/Brokensmile47/Malaitechx.git\`

⭐ _Star the repo if you enjoy the bot!_
✨ _Made By Kɪᴍᴀɴɪ Samuel 💎_`;

    await sock.sendMessage(chatId, { text, ...channelInfo }, { quoted: message });
}

module.exports = githubCommand;
