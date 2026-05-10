// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

// ⭐ ADD THIS HELPER FUNCTION
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');
const { autorecordCommand, isAutorecordEnabled, handleAutorecord } = require('./commands/autorecord');

// Command imports
const style1917Command = require('./commands/1917style');
const antidelete_statusCommand = require('./commands/antidelete_status');
const pairCommand = require('./commands/pair');
const recipeCommand = require('./commands/recipe');
const rejectCommand = require('./commands/reject');
const reverseCommand = require('./commands/reverse');
const robotCommand = require('./commands/robot');
const royaltextCommand = require('./commands/royaltext');
const runtimeCommand = require('./commands/runtime');
const savestatusCommand = require('./commands/savestatus');
const setdescCommand = require('./commands/setdesc');
const setgroupnameCommand = require('./commands/setgroupname');
const setppgroupCommand = require('./commands/setppgroup');
const song2Command = require('./commands/song2');
const sticker_altCommand = require('./commands/sticker-alt');
const storyCommand = require('./commands/story');
const summarizeCommand = require('./commands/summarize');
const summerbeachCommand = require('./commands/summerbeach');
const tagadminCommand = require('./commands/tagadmin');
const teachCommand = require('./commands/teach');
const tiktokaudioCommand = require('./commands/tiktokaudio');
const tomp3Command = require('./commands/tomp3');
const topographyCommand = require('./commands/topography');
const topttCommand = require('./commands/toptt');
const tosgroupCommand = require('./commands/tosgroup');
const totalmembersCommand = require('./commands/totalmembers');
const translate2Command = require('./commands/translate2');
const truthdetectorCommand = require('./commands/truthdetector');
const twitterCommand = require('./commands/twitter');
const typographyCommand = require('./commands/typography');
const useridCommand = require('./commands/userid');
const videodocCommand = require('./commands/videodoc');
const volaudioCommand = require('./commands/volaudio');
const wallpaperCommand = require('./commands/wallpaper');
const watercolortextCommand = require('./commands/watercolortext');
const writetextCommand = require('./commands/writetext');
const xvideoCommand = require('./commands/xvideo');
const xxqcCommand = require('./commands/xxqc');
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const vcfCommand = require('./commands/vcf');
const upCommand  = require('./commands/up');
const { antistatusCommand, storeStatus, handleDeletedStatus } = require('./commands/antistatus');
const { antideleteViewOnceCommand, storeViewOnce, handleDeletedViewOnce } = require('./commands/antideleteviewonce');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const vv2Command     = require('./commands/vv2');
const ping2Command   = require('./commands/ping2');
const getppCommand   = require('./commands/getpp');
const { bioCommand, startBioUpdater } = require('./commands/bio');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand, reactStart, reactError, reactToEveryMessage } = require('./lib/reactions');
const { registerUser, getUserCount } = require('./lib/userTracker');
global.getUserCount = getUserCount;
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');
const { openGroupCommand, closeGroupCommand } = require('./commands/openclose');
const imgCommand = require('./commands/img');
const presenceCommand = require('./commands/presence');
const pornCommand = require('./commands/porn');
const gifCommand = require('./commands/gif');
const timeCommand = require('./commands/time');
const { greetCommand, handleGreet, isGreetEnabled } = require('./commands/greet');
const { setPrefixCommand, getPrefix } = require('./commands/setprefix');
const { handleSongReply } = require('./commands/song');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
// ✨ Made by Kimani Samuel 💎
// 📢 Follow: https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p
global.ytch = "N/A";
global.channelLink = "https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p";
global.footer = "\n\n*Made By Kimani Samuel*\n📢 " + global.channelLink;

// Add this near the top of main.js with other global configurations
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

async function initBioUpdater(sock) {
    try { await startBioUpdater(sock); } catch (_) {}
}

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        handleAutoread(sock, message).catch(() => {});
        handleAutorecord(sock, message.key.remoteJid).catch(() => {});

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
            storeStatus(message);
            storeViewOnce(message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            const deletedKey = message.message.protocolMessage.key;
            await handleMessageRevocation(sock, message);
            handleDeletedStatus(sock, deletedKey).catch(() => {});
            handleDeletedViewOnce(sock, deletedKey).catch(() => {});
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        // Track unique users
        registerUser(senderId);
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // ⭐ FIX: Add presence update to show bot is active
        if (!message.key.fromMe) {
            try {
                await sock.sendPresenceUpdate('available', chatId);
            } catch (e) { }
        }

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;

            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
// ✨ Made by Kimani Samuel 💎
// 📢 Follow my WhatsApp Channel: https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, {
                    text: `🔗 *Support*\n\nhttps://chat.whatsapp.com/GA4WrOFythU6g3BFVubYM7?mode=wwt`
                }, { quoted: message });
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // ✅ FIX: Check song reply FIRST before tictactoe, so numbers 1/2/3
        // are not swallowed by the tictactoe handler when a song session is active
        try {
            if (await handleSongReply(sock, chatId, message)) {
                return;
            }
        } catch (e) { }

        // Then check if it's a game move (only if no song session matched)
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // ── AutoReact: react with a random emoji to EVERY incoming message ──
        if (!message.key.fromMe) {
            reactToEveryMessage(sock, message).catch(() => {});
        }

        // Check for bad words and antilink FIRST, before ANY other processing
        // Always run moderation in groups, regardless of mode
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled (do not ban)
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Greet handler: reply to private messages when greet is enabled
        if (!isGroup && !message.key.fromMe) {
            try {
                if (isGreetEnabled()) {
                    await handleGreet(sock, chatId, message, senderId);
                }
            } catch (e) { }
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                // Only run chatbot in public mode or for owner/sudo
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.setgdesc', '.setgname', '.setgpp', '.open', '.close'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.autotyping', '.autoread', '.autorecord', '.bio', '.pmblocker'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        // We'll show typing indicator after command execution if needed
        let commandExecuted = false;

        reactStart(sock, message, userMessage).catch(() => {});

        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
            case userMessage.startsWith('.delete') || userMessage.startsWith('.del'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'):
                // Check if sender is the owner
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo }, { quoted: message });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'Usage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.anticall'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
            case userMessage === '.tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === '.tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage.startsWith('.antitag'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                commandExecuted = true;
                break;
            case userMessage === '.up':
                await upCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.vcf'):
                await vcfCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.antistatus'):
                await antistatusCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.antideleteviewonce') || userMessage.startsWith('.antiviewonce'):
                await antideleteViewOnceCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.ping': {
                // ⭐ FIX: Add human-like delay and typing indicator
                await sock.sendPresenceUpdate('composing', chatId);
                await delay(800 + Math.random() * 1200);  // 0.8-2 second delay
                await pingCommand(sock, chatId, message);
                await sock.sendPresenceUpdate('paused', chatId);
                commandExecuted = true;
                break;
            }
            case userMessage === '.alive':
                // ⭐ FIX: Add delay for .alive too
                await sock.sendPresenceUpdate('composing', chatId);
                await delay(600 + Math.random() * 1000);
                await aliveCommand(sock, chatId, message);
                await sock.sendPresenceUpdate('paused', chatId);
                break;
            case userMessage.startsWith('.mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === '.setmention':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case userMessage.startsWith('.blur'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
            case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take') || userMessage.startsWith('.steal'):
                {
                    const isSteal = userMessage.startsWith('.steal');
                    const sliceLen = isSteal ? 6 : 5; // '.steal' vs '.take'
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage === '.vv2':
                await vv2Command(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage === '.ping2':
                await ping2Command(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.getpp'):
                await getppCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.bio'):
                await bioCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autostatus'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith('.setgdesc'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgname'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || (userMessage === '.ig' || userMessage.startsWith('.ig ')):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.igsc'):
                await igsCommand(sock, chatId, message, true);
                break;
            case userMessage.startsWith('.igs'):
                await igsCommand(sock, chatId, message, false);
                break;
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.spotify'):
                await spotifyCommand(sock, chatId, message);
                break;
            case (
    userMessage.startsWith('.play') ||
    userMessage.startsWith('.mp3') ||
    userMessage.startsWith('.ytmp3') ||
    userMessage.startsWith('.song')
): {

    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        ""

    const parts = text.trim().split(/\s+/)

    const args = parts.slice(1) // remove command

    await songCommand(sock, chatId, message, args)

    break
}
                break;
            case userMessage.startsWith('.video') || userMessage.startsWith('.ytmp4'):
                await videoCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                break;
            case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'): await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid': await groupJidCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.autoread'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.autorecord'):
                await autorecordCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.heart'):
                await handleHeart(sock, chatId, message);
                break;
            case userMessage.startsWith('.horny'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.circle'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lgbt'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lolice'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.simpcard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tonikawa'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.its-so-stupid'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith('.oogway2'):
            case userMessage.startsWith('.oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tweet'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytcomment'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.comrade'):
            case userMessage.startsWith('.gay'):
            case userMessage.startsWith('.glass'):
            case userMessage.startsWith('.jail'):
            case userMessage.startsWith('.passed'):
            case userMessage.startsWith('.triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(1).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            // animu aliases
            case userMessage.startsWith('.nom'):
            case userMessage.startsWith('.poke'):
            case userMessage.startsWith('.cry'):
            case userMessage.startsWith('.kiss'):
            case userMessage.startsWith('.pat'):
            case userMessage.startsWith('.hug'):
            case userMessage.startsWith('.wink'):
            case userMessage.startsWith('.facepalm'):
            case userMessage.startsWith('.face-palm'):
            case userMessage.startsWith('.animuquote'):
            case userMessage.startsWith('.quote'):
            case userMessage.startsWith('.loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(1);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'quote' || sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === '.crop':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === '.china':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === '.indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === '.japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === '.korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === '.india':
                await piesAlias(sock, chatId, message, 'india');
                commandExecuted = true;
                break;
            case userMessage === '.malaysia':
                await piesAlias(sock, chatId, message, 'malaysia');
                commandExecuted = true;
                break;
            case userMessage === '.thailand':
                await piesAlias(sock, chatId, message, 'thailand');
                commandExecuted = true;
                break;
            case userMessage.startsWith('.update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                break;

            // 🔓 OPEN GROUP
            case userMessage === '.open':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!' }, { quoted: message });
                    break;
                }
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '❌ Only admins can open the group.' }, { quoted: message });
                    break;
                }
                await openGroupCommand(sock, chatId, senderId, message);
                commandExecuted = true;
                break;

            // 🔒 CLOSE GROUP
            case userMessage === '.close':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!' }, { quoted: message });
                    break;
                }
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '❌ Only admins can close the group.' }, { quoted: message });
                    break;
                }
                await closeGroupCommand(sock, chatId, senderId, message);
                commandExecuted = true;
                break;

            // 🖼️ IMAGE SEARCH
            case userMessage.startsWith('.img'):
                {
                    const imgQuery = rawText.slice(4).trim();
                    await imgCommand(sock, chatId, message, imgQuery);
                    commandExecuted = true;
                }
                break;

            // 👁️ PRESENCE STATUS
            case userMessage === '.presence':
                await presenceCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // 🔞 ADULT CONTENT
            case userMessage === '.porn' || userMessage === '.adult' || userMessage === '.xx':
                await pornCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // ── GREET COMMAND (owner only) ──────────────────────
            case userMessage.startsWith('.greet'):
                await greetCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // ── SET PREFIX (owner only) ─────────────────────────
            case userMessage.startsWith('.setprefix'):
                await setPrefixCommand(sock, chatId, message, senderId);
                commandExecuted = true;
                break;

            // ── GIF ─────────────────────────────────────────────
            case userMessage.startsWith('.gif'):
                {
                    const gifQuery = rawText.slice(4).trim();
                    await gifCommand(sock, chatId, gifQuery);
                    commandExecuted = true;
                }
                break;

            // ── TIME ────────────────────────────────────────────
            case userMessage === '.time':
                await timeCommand(sock, chatId, message, []);
                commandExecuted = true;
                break;

            // ── PAIR ────────────────────────────────────────────
            case userMessage.startsWith('.pair'):
                {
                    const pairArg = rawText.slice(5).trim();
                    await pairCommand(sock, chatId, message, pairArg);
                    commandExecuted = true;
                }
                break;

            // ── RECIPE ──────────────────────────────────────────
            case userMessage.startsWith('.recipe'):
                {
                    const recipeArgs = rawText.slice(7).trim().split(/\s+/);
                    await recipeCommand(sock, chatId, message, recipeArgs);
                    commandExecuted = true;
                }
                break;

            // ── REJECT ──────────────────────────────────────────
            case userMessage.startsWith('.reject'):
                {
                    const rejectArgs = rawText.slice(7).trim().split(/\s+/);
                    await rejectCommand(sock, chatId, message, rejectArgs);
                    commandExecuted = true;
                }
                break;

            // ── REVERSE ─────────────────────────────────────────
            case userMessage.startsWith('.reverse'):
                {
                    const reverseArgs = rawText.slice(8).trim().split(/\s+/);
                    await reverseCommand(sock, chatId, message, reverseArgs);
                    commandExecuted = true;
                }
                break;

            // ── ROBOT ───────────────────────────────────────────
            case userMessage.startsWith('.robot'):
                {
                    const robotArgs = rawText.slice(6).trim().split(/\s+/);
                    await robotCommand(sock, chatId, message, robotArgs);
                    commandExecuted = true;
                }
                break;

            // ── ROYALTEXT ───────────────────────────────────────
            case userMessage.startsWith('.royaltext'):
                {
                    const royalArgs = rawText.slice(10).trim().split(/\s+/);
                    await royaltextCommand(sock, chatId, message, royalArgs);
                    commandExecuted = true;
                }
                break;

            // ── RUNTIME ─────────────────────────────────────────
            case userMessage === '.runtime':
                await runtimeCommand(sock, chatId, message, []);
                commandExecuted = true;
                break;

            // ── SAVESTATUS ──────────────────────────────────────
            case userMessage.startsWith('.savestatus'):
                {
                    const saveArgs = rawText.slice(11).trim().split(/\s+/);
                    await savestatusCommand(sock, chatId, message, saveArgs);
                    commandExecuted = true;
                }
                break;

            // ── SETDESC ─────────────────────────────────────────
            case userMessage.startsWith('.setdesc'):
                {
                    const setdescArgs = rawText.slice(8).trim().split(/\s+/);
                    await setdescCommand(sock, chatId, message, setdescArgs);
                    commandExecuted = true;
                }
                break;

            // ── SETGROUPNAME ────────────────────────────────────
            case userMessage.startsWith('.setgroupname'):
                {
                    const sgnArgs = rawText.slice(13).trim().split(/\s+/);
                    await setgroupnameCommand(sock, chatId, message, sgnArgs);
                    commandExecuted = true;
                }
                break;

            // ── SETPPGROUP ──────────────────────────────────────
            case userMessage.startsWith('.setppgroup'):
                {
                    const sppgArgs = rawText.slice(11).trim().split(/\s+/);
                    await setppgroupCommand(sock, chatId, message, sppgArgs);
                    commandExecuted = true;
                }
                break;

            // ── SONG2 ───────────────────────────────────────────
            case userMessage.startsWith('.song2'):
                {
                    const song2Args = rawText.slice(6).trim().split(/\s+/);
                    await song2Command(sock, chatId, message, song2Args);
                    commandExecuted = true;
                }
                break;

            // ── STICKER-ALT ─────────────────────────────────────
            case userMessage === '.salt' || userMessage === '.stickeralt' || userMessage === '.sticker2':
                await sticker_altCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // ── STORY ───────────────────────────────────────────
            case userMessage.startsWith('.story'):
                {
                    const storyArgs = rawText.slice(6).trim().split(/\s+/);
                    await storyCommand(sock, chatId, message, storyArgs);
                    commandExecuted = true;
                }
                break;

            // ── SUMMARIZE ───────────────────────────────────────
            case userMessage.startsWith('.summarize') || userMessage.startsWith('.sum'):
                {
                    const sumArgs = userMessage.startsWith('.summarize')
                        ? rawText.slice(10).trim().split(/\s+/)
                        : rawText.slice(4).trim().split(/\s+/);
                    await summarizeCommand(sock, chatId, message, sumArgs);
                    commandExecuted = true;
                }
                break;

            // ── SUMMERBEACH ─────────────────────────────────────
            case userMessage.startsWith('.summerbeach'):
                {
                    const sbArgs = rawText.slice(12).trim().split(/\s+/);
                    await summerbeachCommand(sock, chatId, message, sbArgs);
                    commandExecuted = true;
                }
                break;

            // ── TAGADMIN ────────────────────────────────────────
            case userMessage === '.tagadmin':
                {
                    await tagadminCommand(sock, chatId, message, []);
                    commandExecuted = true;
                }
                break;

            // ── TEACH ───────────────────────────────────────────
            case userMessage.startsWith('.teach'):
                {
                    const teachArgs = rawText.slice(6).trim().split(/\s+/);
                    await teachCommand(sock, chatId, message, teachArgs);
                    commandExecuted = true;
                }
                break;

            // ── TIKTOKAUDIO ─────────────────────────────────────
            case userMessage.startsWith('.tiktokaudio') || userMessage.startsWith('.ttaudio'):
                {
                    const ttaArgs = userMessage.startsWith('.tiktokaudio')
                        ? rawText.slice(12).trim().split(/\s+/)
                        : rawText.slice(8).trim().split(/\s+/);
                    await tiktokaudioCommand(sock, chatId, message, ttaArgs);
                    commandExecuted = true;
                }
                break;

            // ── TOMP3 ───────────────────────────────────────────
            case userMessage.startsWith('.tomp3'):
                {
                    const tomp3Args = rawText.slice(6).trim().split(/\s+/);
                    await tomp3Command(sock, chatId, message, tomp3Args);
                    commandExecuted = true;
                }
                break;

            // ── TOPOGRAPHY ──────────────────────────────────────
            case userMessage.startsWith('.topography'):
                {
                    const topgArgs = rawText.slice(11).trim().split(/\s+/);
                    await topographyCommand(sock, chatId, message, topgArgs);
                    commandExecuted = true;
                }
                break;

            // ── TOPTT ───────────────────────────────────────────
            case userMessage.startsWith('.toptt'):
                {
                    const topttArgs = rawText.slice(6).trim().split(/\s+/);
                    await topttCommand(sock, chatId, message, topttArgs);
                    commandExecuted = true;
                }
                break;

            // ── TOSGROUP ────────────────────────────────────────
            case userMessage.startsWith('.tosgroup'):
                {
                    const tosgArgs = rawText.slice(9).trim().split(/\s+/);
                    await tosgroupCommand(sock, chatId, message, tosgArgs);
                    commandExecuted = true;
                }
                break;

            // ── TOTALMEMBERS ────────────────────────────────────
            case userMessage === '.totalmembers':
                await totalmembersCommand(sock, chatId, message, []);
                commandExecuted = true;
                break;

            // ── TRANSLATE2 ──────────────────────────────────────
            case userMessage.startsWith('.translate2') || userMessage.startsWith('.trt2'):
                {
                    const trt2Len = userMessage.startsWith('.translate2') ? 11 : 5;
                    const trt2Args = rawText.slice(trt2Len).trim().split(/\s+/);
                    await translate2Command(sock, chatId, message, trt2Args);
                    commandExecuted = true;
                }
                break;

            // ── TRUTHDETECTOR ───────────────────────────────────
            case userMessage.startsWith('.truthdetector') || userMessage.startsWith('.lie'):
                {
                    const tdLen = userMessage.startsWith('.truthdetector') ? 14 : 4;
                    const tdArgs = rawText.slice(tdLen).trim().split(/\s+/);
                    await truthdetectorCommand(sock, chatId, message, tdArgs);
                    commandExecuted = true;
                }
                break;

            // ── TWITTER ─────────────────────────────────────────
            case userMessage.startsWith('.twitter') || userMessage.startsWith('.twdl'):
                {
                    const twLen = userMessage.startsWith('.twitter') ? 8 : 5;
                    const twArgs = rawText.slice(twLen).trim().split(/\s+/);
                    await twitterCommand(sock, chatId, message, twArgs);
                    commandExecuted = true;
                }
                break;

            // ── TYPOGRAPHY ──────────────────────────────────────
            case userMessage.startsWith('.typography'):
                {
                    const typArgs = rawText.slice(11).trim().split(/\s+/);
                    await typographyCommand(sock, chatId, message, typArgs);
                    commandExecuted = true;
                }
                break;

            // ── USERID ──────────────────────────────────────────
            case userMessage === '.userid' || userMessage === '.uid':
                {
                    await useridCommand(sock, chatId, message, []);
                    commandExecuted = true;
                }
                break;

            // ── VIDEODOC ────────────────────────────────────────
            case userMessage.startsWith('.videodoc'):
                {
                    const vdArgs = rawText.slice(9).trim().split(/\s+/);
                    await videodocCommand(sock, chatId, message, vdArgs);
                    commandExecuted = true;
                }
                break;

            // ── VOLAUDIO ────────────────────────────────────────
            case userMessage.startsWith('.volaudio'):
                {
                    const vaArgs = rawText.slice(9).trim().split(/\s+/);
                    await volaudioCommand(sock, chatId, message, vaArgs);
                    commandExecuted = true;
                }
                break;

            // ── WALLPAPER ───────────────────────────────────────
            case userMessage.startsWith('.wallpaper') || userMessage.startsWith('.wp'):
                {
                    const wpLen = userMessage.startsWith('.wallpaper') ? 10 : 3;
                    const wpArgs = rawText.slice(wpLen).trim().split(/\s+/);
                    await wallpaperCommand(sock, chatId, message, wpArgs);
                    commandExecuted = true;
                }
                break;

            // ── WATERCOLORTEXT ──────────────────────────────────
            case userMessage.startsWith('.watercolortext') || userMessage.startsWith('.wct'):
                {
                    const wctLen = userMessage.startsWith('.watercolortext') ? 15 : 4;
                    const wctArgs = rawText.slice(wctLen).trim().split(/\s+/);
                    await watercolortextCommand(sock, chatId, message, wctArgs);
                    commandExecuted = true;
                }
                break;

            // ── WRITETEXT ───────────────────────────────────────
            case userMessage.startsWith('.writetext') || userMessage.startsWith('.wt'):
                {
                    const wtLen = userMessage.startsWith('.writetext') ? 10 : 3;
                    const wtArgs = rawText.slice(wtLen).trim().split(/\s+/);
                    await writetextCommand(sock, chatId, message, wtArgs);
                    commandExecuted = true;
                }
                break;

            // ── XVIDEO ──────────────────────────────────────────
            case userMessage.startsWith('.xvideo') || userMessage.startsWith('.xv'):
                {
                    const xvLen = userMessage.startsWith('.xvideo') ? 7 : 3;
                    const xvArgs = rawText.slice(xvLen).trim().split(/\s+/);
                    await xvideoCommand(sock, chatId, message, xvArgs);
                    commandExecuted = true;
                }
                break;

            // ── XXQC ────────────────────────────────────────────
            case userMessage.startsWith('.xxqc'):
                {
                    const xxqcArgs = rawText.slice(5).trim().split(/\s+/);
                    await xxqcCommand(sock, chatId, message, xxqcArgs);
                    commandExecuted = true;
                }
                break;

            // ── 1917STYLE ───────────────────────────────────────
            case userMessage.startsWith('.1917style'):
                {
                    const styleArgs = rawText.slice(10).trim().split(/\s+/);
                    await style1917Command(sock, chatId, message, styleArgs);
                    commandExecuted = true;
                }
                break;

            // ── ANTIDELETE_STATUS ───────────────────────────────
            case userMessage.startsWith('.antidelete_status') || userMessage.startsWith('.adstatus'):
                {
                    const adsLen = userMessage.startsWith('.antidelete_status') ? 18 : 9;
                    const adsArgs = rawText.slice(adsLen).trim().split(/\s+/);
                    await antidelete_statusCommand(sock, chatId, message, adsArgs);
                    commandExecuted = true;
                }
                break;

            default:
                if (isGroup) {
                    // Handle non-command group messages
                    if (userMessage) {  // Make sure there's a message
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            // Command was executed, now show typing status after command execution
            await showTypingAfterCommand(sock, chatId);
        }

        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }

   const chatId = message.key?.remoteJid;

if (userMessage?.startsWith('.')) {
    if (commandExecuted !== false) {
        await addCommandReaction(sock, message);
    } else {
        try {
            await sock.sendMessage(chatId, {
                react: { text: '❌', key: message.key }
            });
        } catch (_) {}
    }
}
        catch (error) {
    console.error('❌ Error in message handler:', error.message);

    try {
        if (typeof reactError === 'function') reactError(sock, message).catch(() => {});
    } catch (_) {}

    if (chatId) {
        await sock.sendMessage(chatId, {
            text: '❌ Failed to process command!',
            ...channelInfo
        });
    }
}
async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
            // If reading fails, default to public behavior
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    initBioUpdater,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};
