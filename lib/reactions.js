/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Reactions System
 * Handles emoji reactions for all bot commands
 */

const fs = require('fs');
const path = require('path');

const areactConfigPath = path.join(__dirname, '..', 'data', 'areact.json');

// ─── React helper ────────────────────────────────────────────────────────────
async function react(sock, message, emoji) {
    try {
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (err) {
        // Silent fail — reactions are non-critical
    }
}

// ─── Starting emoji map ───────────────────────────────────────────────────────
const startEmojiMap = [
    // Media / Downloads
    { match: ['.play', '.mp3', '.ytmp3', '.song'],          emojis: ['🎶', '🔍'] },
    { match: ['.video', '.ytmp4'],                           emojis: ['🎬', '🔍'] },
    { match: ['.tiktok', '.tt'],                             emojis: ['🎵', '🔍'] },
    { match: ['.instagram', '.insta', '.ig'],                emojis: ['📸', '🔍'] },
    { match: ['.igsc', '.igs'],                              emojis: ['📸', '🔍'] },
    { match: ['.fb', '.facebook'],                           emojis: ['📘', '🔍'] },
    { match: ['.spotify'],                                   emojis: ['🎵', '🔍'] },
    { match: ['.music'],                                     emojis: ['🎵', '🔍'] },
    { match: ['.lyrics'],                                    emojis: ['🎵', '🔍'] },
    { match: ['.sora'],                                      emojis: ['🎬', '🔍'] },
    { match: ['.ss', '.ssweb', '.screenshot'],               emojis: ['📸', '🔍'] },
    // AI
    { match: ['.gpt', '.gemini'],                            emojis: ['🤖', '💭'] },
    { match: ['.imagine', '.flux', '.dalle'],                emojis: ['🎨', '✨'] },
    { match: ['.chatbot'],                                   emojis: ['🤖'] },
    { match: ['.translate', '.trt'],                         emojis: ['🌐'] },
    // Image editing
    { match: ['.removebg', '.rmbg', '.nobg'],                emojis: ['✂️', '🔍'] },
    { match: ['.remini', '.enhance', '.upscale'],            emojis: ['✨', '🔍'] },
    { match: ['.sticker', '.s'],                             emojis: ['🎨'] },
    { match: ['.attp'],                                      emojis: ['🎨'] },
    { match: ['.blur'],                                      emojis: ['🖼️'] },
    { match: ['.emojimix', '.emix'],                         emojis: ['😊'] },
    { match: ['.tg', '.stickertelegram', '.tgsticker', '.telesticker'], emojis: ['🎨'] },
    { match: ['.simage'],                                    emojis: ['🖼️'] },
    { match: ['.tourl', '.url'],                             emojis: ['🔗'] },
    { match: ['.crop'],                                      emojis: ['✂️'] },
    { match: ['.take', '.steal'],                            emojis: ['🎨'] },
    // Canvas / effects
    { match: ['.metallic', '.ice', '.snow', '.impressive', '.matrix', '.light', '.neon', '.devil', '.purple', '.thunder', '.leaves', '.1917', '.arena', '.hacker', '.sand', '.blackpink', '.glitch', '.fire'], emojis: ['🎨'] },
    { match: ['.tweet'],                                     emojis: ['🐦'] },
    { match: ['.ytcomment'],                                 emojis: ['💬'] },
    { match: ['.oogway', '.oogway2'],                        emojis: ['🐢'] },
    { match: ['.namecard'],                                  emojis: ['💌'] },
    { match: ['.simpcard'],                                  emojis: ['💘'] },
    { match: ['.tonikawa'],                                  emojis: ['💕'] },
    { match: ['.lolice'],                                    emojis: ['🚔'] },
    { match: ['.lgbt'],                                      emojis: ['🏳️‍🌈'] },
    { match: ['.circle'],                                    emojis: ['⭕'] },
    { match: ['.heart'],                                     emojis: ['❤️'] },
    { match: ['.pies'],                                      emojis: ['🦶'] },
    { match: ['.comrade', '.gay', '.glass', '.jail', '.passed', '.triggered'], emojis: ['🖼️'] },
    { match: ['.animu', '.nom', '.poke', '.cry', '.kiss', '.pat', '.hug', '.wink', '.facepalm', '.face-palm', '.animuquote'], emojis: ['🎌'] },
    { match: ['.its-so-stupid'],                             emojis: ['😂'] },
    { match: ['.horny'],                                     emojis: ['🔞'] },
    { match: ['.loli'],                                      emojis: ['🎌'] },
    // Fun / games
    { match: ['.meme'],                                      emojis: ['😂'] },
    { match: ['.joke'],                                      emojis: ['😄'] },
    { match: ['.quote'],                                     emojis: ['💬'] },
    { match: ['.fact'],                                      emojis: ['🤓'] },
    { match: ['.ttt', '.tictactoe'],                         emojis: ['🎮'] },
    { match: ['.move'],                                      emojis: ['♟️'] },
    { match: ['.hangman'],                                   emojis: ['🎮'] },
    { match: ['.trivia'],                                    emojis: ['🧠'] },
    { match: ['.answer'],                                    emojis: ['💡'] },
    { match: ['.guess'],                                     emojis: ['🤔'] },
    { match: ['.8ball'],                                     emojis: ['🎱'] },
    { match: ['.dare'],                                      emojis: ['🎯'] },
    { match: ['.truth'],                                     emojis: ['💯'] },
    { match: ['.compliment'],                                emojis: ['🥰'] },
    { match: ['.insult'],                                    emojis: ['😤'] },
    { match: ['.simp'],                                      emojis: ['💘'] },
    { match: ['.stupid', '.itssostupid', '.iss'],            emojis: ['😂'] },
    { match: ['.flirt'],                                     emojis: ['💕'] },
    { match: ['.ship'],                                      emojis: ['💕'] },
    { match: ['.character'],                                 emojis: ['🎭'] },
    { match: ['.waste'],                                     emojis: ['🗑️'] },
    { match: ['.goodnight', '.lovenight', '.gn'],            emojis: ['🌙'] },
    { match: ['.shayari', '.shayri'],                        emojis: ['🌹'] },
    { match: ['.roseday'],                                   emojis: ['🌹'] },
    { match: ['.china'],                                     emojis: ['🇨🇳'] },
    { match: ['.indonesia'],                                 emojis: ['🇮🇩'] },
    { match: ['.japan'],                                     emojis: ['🇯🇵'] },
    { match: ['.korea'],                                     emojis: ['🇰🇷'] },
    { match: ['.india'],                                     emojis: ['🇮🇳'] },
    { match: ['.malaysia'],                                  emojis: ['🇲🇾'] },
    { match: ['.thailand'],                                  emojis: ['🇹🇭'] },
    // Group management
    { match: ['.kick'],                                      emojis: ['👢'] },
    { match: ['.mute'],                                      emojis: ['🔇'] },
    { match: ['.unmute'],                                    emojis: ['🔊'] },
    { match: ['.ban'],                                       emojis: ['🔨'] },
    { match: ['.unban'],                                     emojis: ['🔓'] },
    { match: ['.warn'],                                      emojis: ['⚠️'] },
    { match: ['.warnings'],                                  emojis: ['📊'] },
    { match: ['.promote'],                                   emojis: ['⬆️'] },
    { match: ['.demote'],                                    emojis: ['⬇️'] },
    { match: ['.tagall'],                                    emojis: ['📢'] },
    { match: ['.hidetag'],                                   emojis: ['📢'] },
    { match: ['.tag'],                                       emojis: ['📢'] },
    { match: ['.antilink'],                                  emojis: ['🔗'] },
    { match: ['.antibadword'],                               emojis: ['🤐'] },
    { match: ['.antidelete'],                                emojis: ['🛡️'] },
    { match: ['.antitag'],                                   emojis: ['🏷️'] },
    { match: ['.anticall'],                                  emojis: ['📵'] },
    { match: ['.welcome'],                                   emojis: ['👋'] },
    { match: ['.goodbye'],                                   emojis: ['👋'] },
    { match: ['.groupinfo', '.infogp', '.infogrupo'],        emojis: ['ℹ️'] },
    { match: ['.staff', '.admins', '.listadmin'],            emojis: ['👑'] },
    { match: ['.resetlink', '.revoke', '.anularlink'],       emojis: ['🔗'] },
    { match: ['.topmembers'],                                emojis: ['🏆'] },
    { match: ['.setgdesc'],                                  emojis: ['📝'] },
    { match: ['.setgname'],                                  emojis: ['✏️'] },
    { match: ['.setgpp'],                                    emojis: ['🖼️'] },
    // Utility
    { match: ['.tts'],                                       emojis: ['🔊'] },
    { match: ['.delete', '.del'],                            emojis: ['🗑️'] },
    { match: ['.clear'],                                     emojis: ['🗑️'] },
    { match: ['.ping'],                                      emojis: ['🏓'] },
    { match: ['.alive'],                                     emojis: ['💚'] },
    { match: ['.weather'],                                   emojis: ['🌤️'] },
    { match: ['.news'],                                      emojis: ['📰'] },
    { match: ['.help', '.menu', '.bot', '.list'],            emojis: ['📋'] },
    { match: ['.settings'],                                  emojis: ['⚙️'] },
    { match: ['.mode'],                                      emojis: ['⚙️'] },
    { match: ['.owner'],                                     emojis: ['👑'] },
    { match: ['.sudo'],                                      emojis: ['👑'] },
    { match: ['.git', '.github', '.sc', '.script', '.repo'],emojis: ['💻'] },
    { match: ['.jid'],                                       emojis: ['🔍'] },
    { match: ['.vv'],                                        emojis: ['👁️'] },
    { match: ['.mention'],                                   emojis: ['📢'] },
    { match: ['.setmention'],                                emojis: ['📢'] },
    { match: ['.surrender'],                                 emojis: ['🏳️'] },
    { match: ['.update'],                                    emojis: ['🔄'] },
    // Auto features
    { match: ['.autotyping'],                                emojis: ['⌨️'] },
    { match: ['.autoread'],                                  emojis: ['👁️'] },
    { match: ['.autorecord'],                                emojis: ['🎙️'] },
    { match: ['.autostatus'],                                emojis: ['📊'] },
    { match: ['.areact', '.autoreact', '.autoreaction'],     emojis: ['🎭'] },
    { match: ['.pmblocker'],                                 emojis: ['🚫'] },
    { match: ['.setpp'],                                     emojis: ['🖼️'] },
    { match: ['.cleartmp'],                                  emojis: ['🧹'] },
    { match: ['.clearsession', '.clearsesi'],                emojis: ['🧹'] },
];

// ─── Get starting emojis for a command ───────────────────────────────────────
function getStartEmojis(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    for (const entry of startEmojiMap) {
        if (entry.match.some(cmd => msg === cmd || msg.startsWith(cmd + ' '))) {
            return entry.emojis;
        }
    }
    return ['⏳']; // default loading emoji
}

// ─── React with start emojis (fires before command runs) ─────────────────────
async function reactStart(sock, message, userMessage) {
    const emojis = getStartEmojis(userMessage);
    for (const emoji of emojis) {
        await react(sock, message, emoji);
        if (emojis.length > 1) {
            await new Promise(r => setTimeout(r, 800));
        }
    }
}

// ─── React success (✅) ───────────────────────────────────────────────────────
async function addCommandReaction(sock, message) {
    try {
        const configPath = areactConfigPath;
        let areactEnabled = false;
        try {
            if (fs.existsSync(configPath)) {
                const data = JSON.parse(fs.readFileSync(configPath));
                areactEnabled = data.enabled;
            }
        } catch (_) {}

        // Always tick on success
        await react(sock, message, '✅');
    } catch (err) {
        // Silent fail
    }
}

// ─── React failure (❌) ───────────────────────────────────────────────────────
async function reactError(sock, message) {
    await react(sock, message, '❌');
}

// ─── Autoreact (areact) command handler ──────────────────────────────────────
async function handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck) {
    try {
        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            '';
        const args = text.trim().split(' ').slice(1);

        let config = { enabled: false };
        try {
            if (fs.existsSync(areactConfigPath)) {
                config = JSON.parse(fs.readFileSync(areactConfigPath));
            }
        } catch (_) {}

        if (args.length > 0) {
            const action = args[0].toLowerCase();
            if (action === 'on' || action === 'enable') config.enabled = true;
            else if (action === 'off' || action === 'disable') config.enabled = false;
            else {
                await sock.sendMessage(chatId, { text: '❌ Use: .areact on/off' }, { quoted: message });
                return;
            }
        } else {
            config.enabled = !config.enabled;
        }

        fs.mkdirSync(path.dirname(areactConfigPath), { recursive: true });
        fs.writeFileSync(areactConfigPath, JSON.stringify(config, null, 2));

        await sock.sendMessage(chatId, {
            text: `🎭 AutoReact has been ${config.enabled ? '✅ enabled' : '❌ disabled'}!`
        }, { quoted: message });

    } catch (err) {
        console.error('handleAreactCommand error:', err);
        await sock.sendMessage(chatId, { text: '❌ Error toggling autoreact!' }, { quoted: message });
    }
}

module.exports = {
    react,
    reactStart,
    reactError,
    addCommandReaction,
    handleAreactCommand
};
