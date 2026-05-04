/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Song Command
 * Multi-source music downloader with fallbacks
 */

const yts = require('yt-search');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

// ─── Search YouTube ───────────────────────────────────────────────────────────
async function searchYouTube(query) {
    const result = await yts(query);
    const videos = result.videos;
    if (!videos || videos.length === 0) throw new Error('No results found');
    return videos[0];
}

// ─── Downloader APIs (tried in order) ────────────────────────────────────────

// 1. cobalt.tools API
async function tryCobalt(youtubeUrl) {
    const res = await axios.post('https://cobalt.tools/api/json', {
        url: youtubeUrl,
        isAudioOnly: true,
        aFormat: 'mp3',
        filenamePattern: 'basic'
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 15000
    });
    if (res.data?.url) return res.data.url;
    throw new Error('Cobalt: no URL returned');
}

// 2. API from y2mate-style services
async function tryYtdlpApi(youtubeUrl) {
    const videoId = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) throw new Error('No video ID');

    const res = await axios.get(`https://yt-dlp-api.vercel.app/api/audio?id=${videoId}`, {
        timeout: 20000
    });
    if (res.data?.url) return res.data.url;
    throw new Error('ytdlp-api: no URL');
}

// 3. zylalabs / rapidapi style
async function tryZyla(youtubeUrl) {
    const res = await axios.get('https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/', {
        params: { url: youtubeUrl },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
            'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
        },
        timeout: 20000
    });
    if (res.data?.link) return res.data.link;
    throw new Error('Zyla: no link');
}

// 4. yt-dlp local (if installed)
async function tryYtdlpLocal(youtubeUrl, outputPath) {
    const cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${youtubeUrl}" --no-playlist --quiet`;
    await execPromise(cmd, { timeout: 60000 });
    if (fs.existsSync(outputPath)) return outputPath;
    throw new Error('yt-dlp local: file not created');
}

// 5. spotifydown-style generic audio fetcher
async function tryGenericApi(youtubeUrl) {
    const videoId = youtubeUrl.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) throw new Error('No video ID');

    const apis = [
        `https://api.vevioz.com/@api/button/mp3/${videoId}`,
        `https://api.mp3quack.lol/dl?url=${encodeURIComponent(youtubeUrl)}`,
        `https://co.wuk.sh/api/json`
    ];

    for (const api of apis) {
        try {
            const res = await axios.get(api, { timeout: 15000 });
            const url = res.data?.url || res.data?.link || res.data?.dlink || res.data?.download;
            if (url) return url;
        } catch (_) {}
    }
    throw new Error('Generic APIs exhausted');
}

// ─── Download buffer from URL ─────────────────────────────────────────────────
async function downloadBuffer(url) {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    return Buffer.from(res.data);
}

// ─── Main song command ────────────────────────────────────────────────────────
async function songCommand(sock, chatId, message) {
    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text || '';

    const query = text.replace(/^\.(play|mp3|ytmp3|song)\s*/i, '').trim();

    if (!query) {
        return sock.sendMessage(chatId, {
            text: '🎵 Please provide a song name!\nExample: `.play last dance wakadinali`',
            ...channelInfo
        }, { quoted: message });
    }

    let searchingMsg;
    try {
        searchingMsg = await sock.sendMessage(chatId, {
            text: `🔍 Searching for: *${query}*...`,
            ...channelInfo
        }, { quoted: message });
    } catch (_) {}

    let video;
    try {
        video = await searchYouTube(query);
    } catch (err) {
        return sock.sendMessage(chatId, {
            text: `❌ Could not find: *${query}*\nTry a different search term.`,
            ...channelInfo
        }, { quoted: message });
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
    const title = video.title;
    const duration = video.duration?.timestamp || video.duration || 'Unknown';
    const thumbnail = video.thumbnail;

    // Send info card
    try {
        if (thumbnail) {
            const thumbRes = await axios.get(thumbnail, { responseType: 'arraybuffer', timeout: 10000 });
            await sock.sendMessage(chatId, {
                image: Buffer.from(thumbRes.data),
                caption: `🎵 *${title}*\n⏱️ Duration: ${duration}\n🔗 ${youtubeUrl}\n\n⏳ Downloading...`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (_) {}

    // Try downloaders in order
    const tmpDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tmpFile = path.join(tmpDir, `song_${Date.now()}.mp3`);

    let audioBuffer = null;
    const errors = [];

    // Try 1: cobalt
    try {
        const audioUrl = await tryCobalt(youtubeUrl);
        audioBuffer = await downloadBuffer(audioUrl);
        console.log('✅ Song downloaded via Cobalt');
    } catch (e) { errors.push(`Cobalt: ${e.message}`); }

    // Try 2: yt-dlp local
    if (!audioBuffer) {
        try {
            await tryYtdlpLocal(youtubeUrl, tmpFile);
            audioBuffer = fs.readFileSync(tmpFile);
            console.log('✅ Song downloaded via yt-dlp local');
        } catch (e) { errors.push(`yt-dlp local: ${e.message}`); }
    }

    // Try 3: generic APIs
    if (!audioBuffer) {
        try {
            const audioUrl = await tryGenericApi(youtubeUrl);
            audioBuffer = await downloadBuffer(audioUrl);
            console.log('✅ Song downloaded via Generic API');
        } catch (e) { errors.push(`Generic: ${e.message}`); }
    }

    // Try 4: ytdlp-api
    if (!audioBuffer) {
        try {
            const audioUrl = await tryYtdlpApi(youtubeUrl);
            audioBuffer = await downloadBuffer(audioUrl);
            console.log('✅ Song downloaded via ytdlp-api');
        } catch (e) { errors.push(`ytdlp-api: ${e.message}`); }
    }

    // Cleanup tmp file
    try { if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile); } catch (_) {}

    if (!audioBuffer || audioBuffer.length < 10000) {
        console.error('All song downloaders failed:', errors);
        return sock.sendMessage(chatId, {
            text: `❌ Could not download *${title}*\n\nThis song may be blocked in your region. Try:\n• .play ${query} audio\n• .play ${query} lyrics`,
            ...channelInfo
        }, { quoted: message });
    }

    // Send audio
    try {
        await sock.sendMessage(chatId, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ...channelInfo
        }, { quoted: message });

        console.log(`✅ Sent song: ${title}`);
    } catch (err) {
        console.error('Failed to send audio:', err.message);
        await sock.sendMessage(chatId, {
            text: `❌ Downloaded but failed to send the audio. Try again.`,
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = songCommand;
