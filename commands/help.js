const settings = require('../settings');
const fs = require('fs');
const path = require('path');

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5  && hour < 12) return 'Good Morning 🌅';
    if (hour >= 12 && hour < 17) return 'Good Afternoon ☀️';
    if (hour >= 17 && hour < 21) return 'Good Evening 🌆';
    return 'Good Night 🌙';
}

function getDateTime() {
    const now   = new Date();
    const day   = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year  = now.getFullYear();
    let   hours = now.getHours();
    const mins  = String(now.getMinutes()).padStart(2, '0');
    const secs  = String(now.getSeconds()).padStart(2, '0');
    const ampm  = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${mins}:${secs} ${ampm}`
    };
}

async function helpCommand(sock, chatId, message) {
    // Get real user count from tracker
    const getUserCount = global.getUserCount || (() => 0);
    const channelLink = global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p';

    // ── Detect the sender ─────────────────────────────────────────────────────
    const senderJid = message.key.participant || message.key.remoteJid;
    const senderNum = senderJid.split('@')[0];

    // Try to get their saved name
    let senderName = senderNum;
    try {
        const contact = await sock.contactsUpsert || {};
        // Try getName if available
        if (typeof sock.getName === 'function') {
            const name = await sock.getName(senderJid);
            if (name && name !== senderNum) senderName = name;
        }
    } catch (_) {}

    // ── Live date & time ──────────────────────────────────────────────────────
    const { date, time } = getDateTime();
    const greeting       = getGreeting();

    // ── Group user count ──────────────────────────────────────────────────────
    const userCount = getUserCount();

    // ── Info card (matches the style in screenshot) ───────────────────────────
    const infoCard =
`┌──────────────────❖
│  🦈 *MALAITECHX*
├──────────────────❖
│  🤖 ${greeting}
├──────────────────❖
│ 🕵️ USER: *${senderName}*
│ 📱 NUMBER: *+${senderNum}*
│ 📅 DATE: *${date}*
│ ⏰ TIME: *${time}*
│ ⭐ USERS: *${userCount}*
└──────────────────❖`;

    // ── Commands list ─────────────────────────────────────────────────────────
    const commands =
`
╔═══════════════════╗
🌐 *General Commands*:
║ ➤ .help or .menu
║ ➤ .ping
║ ➤ .ping2
║ ➤ .alive
║ ➤ .tts <text>
║ ➤ .owner
║ ➤ .joke
║ ➤ .quote
║ ➤ .fact
║ ➤ .weather <city>
║ ➤ .news
║ ➤ .attp <text>
║ ➤ .lyrics <song>
║ ➤ .8ball <question>
║ ➤ .groupinfo
║ ➤ .staff or .admins
║ ➤ .vv
║ ➤ .vv2
║ ➤ .getpp (reply to msg)
║ ➤ .getpp <number>
║ ➤ .trt <text> <lang>
║ ➤ .ss <link>
║ ➤ .jid
║ ➤ .url
╚═══════════════════╝

╔═══════════════════╗
👮‍♂️ *Admin Commands*:
║ ➤ .ban @user
║ ➤ .promote @user
║ ➤ .demote @user
║ ➤ .mute <minutes>
║ ➤ .unmute
║ ➤ .delete or .del
║ ➤ .kick @user
║ ➤ .warnings @user
║ ➤ .warn @user
║ ➤ .antilink
║ ➤ .antibadword
║ ➤ .clear
║ ➤ .tag <message>
║ ➤ .tagall
║ ➤ .tagnotadmin
║ ➤ .hidetag <message>
║ ➤ .chatbot
║ ➤ .resetlink
║ ➤ .antitag <on/off>
║ ➤ .welcome <on/off>
║ ➤ .goodbye <on/off>
║ ➤ .setgdesc <description>
║ ➤ .setgname <new name>
║ ➤ .setgpp (reply to image)
╚═══════════════════╝

╔═══════════════════╗
🔒 *Owner Commands*:
║ ➤ .mode <public/private>
║ ➤ .clearsession
║ ➤ .antidelete
║ ➤ .cleartmp
║ ➤ .update
║ ➤ .settings
║ ➤ .setpp <reply to image>
║ ➤ .autoreact <on/off>
║ ➤ .autostatus <on/off>
║ ➤ .autotyping <on/off>
║ ➤ .autoread <on/off>
║ ➤ .autorecord <on/off>
║ ➤ .bio <on/off>
║ ➤ .anticall <on/off>
║ ➤ .pmblocker <on/off/status>
║ ➤ .setmention <reply to msg>
║ ➤ .mention <on/off>
╚═══════════════════╝

╔═══════════════════╗
🎨 *Image/Sticker Commands*:
║ ➤ .blur <image>
║ ➤ .simage <reply to sticker>
║ ➤ .sticker <reply to image>
║ ➤ .removebg
║ ➤ .remini
║ ➤ .crop <reply to image>
║ ➤ .tgsticker <Link>
║ ➤ .meme
║ ➤ .take <packname>
║ ➤ .emojimix <emj1>+<emj2>
║ ➤ .igs <insta link>
║ ➤ .igsc <insta link>
╚═══════════════════╝

╔═══════════════════╗
🖼️ *Pies Commands*:
║ ➤ .pies <country>
║ ➤ .china
║ ➤ .indonesia
║ ➤ .japan
║ ➤ .korea
║ ➤ .hijab
╚═══════════════════╝

╔═══════════════════╗
🎮 *Game Commands*:
║ ➤ .tictactoe @user
║ ➤ .hangman
║ ➤ .guess <letter>
║ ➤ .trivia
║ ➤ .answer <answer>
║ ➤ .truth
║ ➤ .dare
╚═══════════════════╝

╔═══════════════════╗
🤖 *AI Commands*:
║ ➤ .gpt <question>
║ ➤ .gemini <question>
║ ➤ .imagine <prompt>
║ ➤ .flux <prompt>
║ ➤ .sora <prompt>
╚═══════════════════╝

╔═══════════════════╗
🎯 *Fun Commands*:
║ ➤ .compliment @user
║ ➤ .insult @user
║ ➤ .flirt
║ ➤ .shayari
║ ➤ .goodnight
║ ➤ .roseday
║ ➤ .character @user
║ ➤ .wasted @user
║ ➤ .ship @user
║ ➤ .simp @user
║ ➤ .stupid @user [text]
╚═══════════════════╝

╔═══════════════════╗
🔤 *Textmaker*:
║ ➤ .metallic <text>
║ ➤ .ice <text>
║ ➤ .snow <text>
║ ➤ .impressive <text>
║ ➤ .matrix <text>
║ ➤ .light <text>
║ ➤ .neon <text>
║ ➤ .devil <text>
║ ➤ .purple <text>
║ ➤ .thunder <text>
║ ➤ .leaves <text>
║ ➤ .1917 <text>
║ ➤ .arena <text>
║ ➤ .hacker <text>
║ ➤ .sand <text>
║ ➤ .blackpink <text>
║ ➤ .glitch <text>
║ ➤ .fire <text>
╚═══════════════════╝

╔═══════════════════╗
📥 *Downloader*:
║ ➤ .play <song_name>
║ ➤ .song <song_name>
║ ➤ .spotify <query>
║ ➤ .instagram <link>
║ ➤ .facebook <link>
║ ➤ .tiktok <link>
║ ➤ .video <song name>
║ ➤ .ytmp4 <Link>
╚═══════════════════╝

╔═══════════════════╗
🧩 *MISC*:
║ ➤ .heart
║ ➤ .horny
║ ➤ .circle
║ ➤ .lgbt
║ ➤ .lolice
║ ➤ .its-so-stupid
║ ➤ .namecard
║ ➤ .oogway
║ ➤ .tweet
║ ➤ .ytcomment
║ ➤ .comrade
║ ➤ .gay
║ ➤ .glass
║ ➤ .jail
║ ➤ .passed
║ ➤ .triggered
╚═══════════════════╝

╔═══════════════════╗
🖼️ *ANIME*:
║ ➤ .nom
║ ➤ .poke
║ ➤ .cry
║ ➤ .kiss
║ ➤ .pat
║ ➤ .hug
║ ➤ .wink
║ ➤ .facepalm
╚═══════════════════╝

╔═══════════════════╗
💻 *Github Commands*:
║ ➤ .git
║ ➤ .github
║ ➤ .sc
║ ➤ .script
║ ➤ .repo
╚═══════════════════╝

*Made By Kimani Samuel*
📢 ${channelLink}

> _Tap below to join our channel_ 👇`;

    const fullCaption = infoCard + commands;

    // ── Channel link shown as "View channel" button via externalAdReply ───────
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
            body: 'Made By Kimani Samuel — Tap to View Channel',
            sourceUrl: channelLink,
            mediaType: 1,
            renderLargerThumbnail: true
        }
    };

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');

        // Read bot image for the externalAdReply thumbnail too
        let imageBuffer = null;
        if (fs.existsSync(imagePath)) {
            imageBuffer = fs.readFileSync(imagePath);
        }

        if (imageBuffer) {
            // Send with MalaiXD logo as the image + channel view button
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: fullCaption,
                contextInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: fullCaption,
                contextInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        try {
            await sock.sendMessage(chatId, { text: fullCaption });
        } catch (_) {}
    }
}

module.exports = helpCommand;
