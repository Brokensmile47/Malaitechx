// Updated by Malaitechx for better downloads
// ============================================================
// 🎵  song.js — Search + Download  (MP3 / MP4 / PTT)
//     Multiple download APIs with auto-fallback
// ============================================================

const yts   = require('yt-search');
const axios = require('axios');

// Per-chat session stores the last song search result
if (!global.songSession) global.songSession = {};

// ── MP3 download — tries 5 APIs in order ─────────────────────
async function fetchMp3Url(videoUrl) {
    const enc = encodeURIComponent(videoUrl);

    const apis = [
        () => axios.get(`https://api.giftedtech.web.id/api/download/ytmp3?apikey=gifted&url=${enc}`, { timeout: 25000 }),
        () => axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${enc}`, { timeout: 25000 }),
        () => axios.get(`https://nayan-video-downloader.vercel.app/ytdl?url=${enc}&type=mp3`, { timeout: 25000 }),
        () => axios.get(`https://p-lucky.vercel.app/api/ytdl?url=${enc}&type=audio`, { timeout: 25000 }),
        () => axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${enc}`, { timeout: 25000 }),
    ];

    for (const call of apis) {
        try {
            const res = await call();
            const d   = res.data;
            const url =
                d?.result?.downloadUrl  ||
                d?.result?.download_url ||
                d?.result?.url          ||
                d?.data?.url            ||
                d?.download_url         ||
                d?.url                  ||
                d?.link;
            if (url) return url;
        } catch (_) {}
    }
    return null;
}

// ── MP4 download — tries 5 APIs in order ─────────────────────
async function fetchMp4Url(videoUrl) {
    const enc = encodeURIComponent(videoUrl);

    const apis = [
        () => axios.get(`https://api.giftedtech.web.id/api/download/ytmp4?apikey=gifted&url=${enc}`, { timeout: 35000 }),
        () => axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${enc}`, { timeout: 35000 }),
        () => axios.get(`https://nayan-video-downloader.vercel.app/ytdl?url=${enc}&type=mp4`, { timeout: 35000 }),
        () => axios.get(`https://p-lucky.vercel.app/api/ytdl?url=${enc}&type=video`, { timeout: 35000 }),
        () => axios.get(`https://apis-keith.vercel.app/download/dlmp4?url=${enc}`, { timeout: 35000 }),
    ];

    for (const call of apis) {
        try {
            const res = await call();
            const d   = res.data;
            const url =
                d?.result?.downloadUrl  ||
                d?.result?.download_url ||
                d?.result?.url          ||
                d?.data?.url            ||
                d?.download_url         ||
                d?.url                  ||
                d?.link;
            if (url) return url;
        } catch (_) {}
    }
    return null;
}

// ── Main command ──────────────────────────────────────────────
async function songCommand(sock, chatId, message, args = []) {
    try {
        const query = args.join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a song name.\n\nExample: *.song last dance*'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `🔍 _Searching for_ *${query}*_..._`
        }, { quoted: message });

        const search = await yts(query);
        const video  = search.videos[0];

        if (!video) {
            return await sock.sendMessage(chatId, {
                text: '❌ No results found. Try a different search term.'
            }, { quoted: message });
        }

        // Save session for this chat
        global.songSession[chatId] = {
            url:       video.url,
            title:     video.title,
            thumbnail: video.thumbnail,
            timestamp: video.duration?.timestamp || 'N/A',
            messageId: null
        };

        const sent = await sock.sendMessage(chatId, {
            image:   { url: video.thumbnail },
            caption:
`🎵 *Song Found!*

📌 *${video.title}*
⏱️ Duration : ${video.duration?.timestamp || 'N/A'}
🔗 ${video.url}

*Reply with a number to download:*
1️⃣  —  🎵 Audio  (MP3)
2️⃣  —  🎬 Video  (MP4)
3️⃣  —  🎤 Voice Note (PTT)`
        }, { quoted: message });

        if (sent?.key?.id) {
            global.songSession[chatId].messageId = sent.key.id;
        }

    } catch (err) {
        console.error('songCommand error:', err.message);
        await sock.sendMessage(chatId, {
            text: '❌ Error searching for song. Please try again.'
        }, { quoted: message });
    }
}

// ── Reply handler ─────────────────────────────────────────────
// Called BEFORE the TicTacToe check in main.js.
// Returns true if this message was a song selection (1 / 2 / 3).

async function handleSongReply(sock, chatId, message) {
    try {
        const session = global.songSession?.[chatId];
        if (!session) return false;

        // Extract user's text
        const userText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || ''
        ).trim();

        // Must be exactly 1, 2, or 3
        if (!/^[123]$/.test(userText)) return false;

        // If the user is replying to a DIFFERENT message, ignore
        const quotedId = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (quotedId && session.messageId && quotedId !== session.messageId) {
            return false;
        }

        const { url, title } = session;

        // Claim session immediately so it can't trigger twice
        delete global.songSession[chatId];

        const labels = { '1': '🎵 Audio (MP3)', '2': '🎬 Video (MP4)', '3': '🎤 Voice Note (PTT)' };

        // Show downloading notice
        await sock.sendMessage(chatId, {
            text: `⬇️ _Downloading_ *${title}* _as ${labels[userText]}...\nPlease wait ⏳_`
        }, { quoted: message });

        if (userText === '1') {
            const dlUrl = await fetchMp3Url(url);
            if (!dlUrl) {
                await sock.sendMessage(chatId, { text: '❌ Audio download failed. All sources are currently unavailable. Please try again later.' });
                return true;
            }
            await sock.sendMessage(chatId, {
                audio:    { url: dlUrl },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            }, { quoted: message });

        } else if (userText === '2') {
            const dlUrl = await fetchMp4Url(url);
            if (!dlUrl) {
                await sock.sendMessage(chatId, { text: '❌ Video download failed. All sources are currently unavailable. Please try again later.' });
                return true;
            }
            await sock.sendMessage(chatId, {
                video:    { url: dlUrl },
                caption:  `🎬 *${title}*`,
                fileName: `${title}.mp4`
            }, { quoted: message });

        } else if (userText === '3') {
            const dlUrl = await fetchMp3Url(url);
            if (!dlUrl) {
                await sock.sendMessage(chatId, { text: '❌ Voice note download failed. All sources are currently unavailable. Please try again later.' });
                return true;
            }
            await sock.sendMessage(chatId, {
                audio:    { url: dlUrl },
                mimetype: 'audio/ogg; codecs=opus',
                ptt:      true
            }, { quoted: message });
        }

        return true;

    } catch (err) {
        console.error('handleSongReply error:', err.message);
        return false;
    }
}

module.exports = songCommand;
module.exports.handleSongReply = handleSongReply;
