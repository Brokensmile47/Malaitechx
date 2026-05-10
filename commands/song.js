// ============================================================
// 🎵  song.js — Search + Download  (Malai XD)
//     Multiple download APIs with auto-fallback
// ============================================================

const yts   = require('yt-search');
const axios = require('axios');

if (!global.songSession) global.songSession = {};

// ── MP3 download — tries multiple APIs ───────────────────────────────────────
async function fetchMp3Url(videoUrl) {
    const enc = encodeURIComponent(videoUrl);
    const vid = videoUrl.match(/[?&]v=([^&]+)/)?.[1] || videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';

    const apis = [
        // API 1 — y2mate style
        async () => {
            const r = await axios.post('https://www.y2mate.com/mates/analyzeV2/ajax', 
                `k_query=${enc}&k_page=home&hl=en&q_auto=0`,
                { timeout: 25000, headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' } });
            const links = r.data?.links?.mp3;
            if (links) {
                const key = Object.keys(links)[0];
                if (links[key]?.k) {
                    const r2 = await axios.post('https://www.y2mate.com/mates/convertV2/index',
                        `vid=${r.data.vid}&k=${links[key].k}`,
                        { timeout: 25000, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
                    if (r2.data?.dlink) return r2.data.dlink;
                }
            }
        },
        // API 2 — giftedtech
        () => axios.get(`https://api.giftedtech.web.id/api/download/ytmp3?apikey=gifted&url=${enc}`, { timeout: 25000 })
            .then(r => r.data?.result?.downloadUrl || r.data?.result?.download_url || r.data?.result?.url || r.data?.data?.url || r.data?.url || r.data?.link),
        // API 3 — siputzx
        () => axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${enc}`, { timeout: 25000 })
            .then(r => r.data?.result?.url || r.data?.data?.url || r.data?.url),
        // API 4 — nayan video downloader
        () => axios.get(`https://nayan-video-downloader.vercel.app/ytdl?url=${enc}&type=mp3`, { timeout: 25000 })
            .then(r => r.data?.url || r.data?.data?.url),
        // API 5 — keith
        () => axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${enc}`, { timeout: 25000 })
            .then(r => r.data?.result?.downloadUrl || r.data?.result?.url || r.data?.url),
        // API 6 — cobalt (public instance)
        async () => {
            const r = await axios.post('https://cobalt.tools/api/json',
                { url: videoUrl, aFormat: 'mp3', isAudioOnly: true },
                { timeout: 25000, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
            return r.data?.url;
        },
        // API 7 — yt-dlp public API
        () => axios.get(`https://yt-dlp-api.vercel.app/download?url=${enc}&format=mp3`, { timeout: 30000 })
            .then(r => r.data?.url || r.data?.downloadUrl),
        // API 8 — loader.to style
        async () => {
            const r = await axios.get(`https://loader.to/ajax/download.php?format=mp3&url=${enc}`, { timeout: 25000 });
            if (r.data?.id) {
                await new Promise(res => setTimeout(res, 5000));
                const r2 = await axios.get(`https://loader.to/ajax/progress.php?id=${r.data.id}`, { timeout: 15000 });
                return r2.data?.download_url;
            }
        }
    ];

    for (const call of apis) {
        try {
            const url = await call();
            if (url && url.startsWith('http')) return url;
        } catch (_) {}
    }
    return null;
}

// ── MP4 download — tries multiple APIs ───────────────────────────────────────
async function fetchMp4Url(videoUrl) {
    const enc = encodeURIComponent(videoUrl);

    const apis = [
        () => axios.get(`https://api.giftedtech.web.id/api/download/ytmp4?apikey=gifted&url=${enc}`, { timeout: 35000 })
            .then(r => r.data?.result?.downloadUrl || r.data?.result?.download_url || r.data?.result?.url || r.data?.data?.url || r.data?.url || r.data?.link),
        () => axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${enc}`, { timeout: 35000 })
            .then(r => r.data?.result?.url || r.data?.data?.url || r.data?.url),
        () => axios.get(`https://nayan-video-downloader.vercel.app/ytdl?url=${enc}&type=mp4`, { timeout: 35000 })
            .then(r => r.data?.url || r.data?.data?.url),
        () => axios.get(`https://apis-keith.vercel.app/download/dlmp4?url=${enc}`, { timeout: 35000 })
            .then(r => r.data?.result?.downloadUrl || r.data?.result?.url || r.data?.url),
        async () => {
            const r = await axios.post('https://cobalt.tools/api/json',
                { url: videoUrl, vQuality: '720' },
                { timeout: 35000, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
            return r.data?.url;
        },
    ];

    for (const call of apis) {
        try {
            const url = await call();
            if (url && url.startsWith('http')) return url;
        } catch (_) {}
    }
    return null;
}

// ── Main command ──────────────────────────────────────────────────────────────
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

// ── Reply handler ─────────────────────────────────────────────────────────────
async function handleSongReply(sock, chatId, message) {
    try {
        const session = global.songSession?.[chatId];
        if (!session) return false;

        const userText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || ''
        ).trim();

        if (!/^[123]$/.test(userText)) return false;

        // If replying to a specific message, make sure it's the right one
        const quotedId = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (quotedId && session.messageId && quotedId !== session.messageId) return false;

        const { url, title } = session;
        delete global.songSession[chatId]; // Claim session immediately

        const labels = { '1': '🎵 Audio (MP3)', '2': '🎬 Video (MP4)', '3': '🎤 Voice Note (PTT)' };

        await sock.sendMessage(chatId, {
            text: `⬇️ _Downloading_ *${title}* _as ${labels[userText]}...\nPlease wait ⏳_`
        }, { quoted: message });

        if (userText === '1') {
            const dlUrl = await fetchMp3Url(url);
            if (!dlUrl) {
                await sock.sendMessage(chatId, { text: '❌ Audio download failed. All download sources are currently unavailable.\nPlease try again in a moment.' });
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
                await sock.sendMessage(chatId, { text: '❌ Video download failed. All download sources are currently unavailable.\nPlease try again in a moment.' });
                return true;
            }
            await sock.sendMessage(chatId, {
                video:    { url: dlUrl },
                caption:  `🎬 *${title}*\n⚡ *Malai XD*`,
                fileName: `${title}.mp4`
            }, { quoted: message });

        } else if (userText === '3') {
            const dlUrl = await fetchMp3Url(url);
            if (!dlUrl) {
                await sock.sendMessage(chatId, { text: '❌ Voice note download failed. Please try again.' });
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
