// 🔞 porn.js — Adult content command (videos under 3 mins)

const axios = require('axios');

const pornCommand = async (sock, chatId, message) => {
    try {
        await sock.sendMessage(chatId, {
            text: '🔞 Fetching adult content... Please wait.',
        }, { quoted: message });

        // RedTube public API — no key needed, returns video metadata
        const apiUrl = 'https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&thumbsize=big&period=week&ordering=mostviewed&limit=20&max_duration=180';

        const response = await axios.get(apiUrl, { timeout: 15000 });
        const videos = response.data?.videos;

        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Could not fetch adult content right now. Try again later.',
            }, { quoted: message });
        }

        // Filter videos under 3 minutes (180 seconds) and pick 4
        const filtered = videos
            .map(v => v.video)
            .filter(v => v && parseInt(v.duration) <= 180 && v.url)
            .slice(0, 4);

        if (filtered.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ No short videos found right now. Try again later.',
            }, { quoted: message });
        }

        // Send header
        await sock.sendMessage(chatId, {
            text: `🔞 *Adult Content* — ${filtered.length} videos found\n\n⚠️ _This content is for adults only (18+)_\n\n⚡ Powered by *MALAITECHX*`,
        }, { quoted: message });

        // Send each video as a link with thumbnail
        for (let i = 0; i < filtered.length; i++) {
            const vid = filtered[i];
            try {
                const thumbUrl = vid.default_thumb || vid.thumbs?.[0]?.src;
                const duration = vid.duration || 'N/A';
                const title = vid.title || `Video ${i + 1}`;
                const videoUrl = vid.url;

                let msgContent;

                if (thumbUrl) {
                    try {
                        const thumbRes = await axios.get(thumbUrl, { responseType: 'arraybuffer', timeout: 10000 });
                        const thumbBuffer = Buffer.from(thumbRes.data);
                        msgContent = {
                            image: thumbBuffer,
                            caption: `🎬 *${i + 1}. ${title}*\n⏱️ Duration: ${duration}s\n🔗 ${videoUrl}`,
                        };
                    } catch (_) {
                        msgContent = {
                            text: `🎬 *${i + 1}. ${title}*\n⏱️ Duration: ${duration}s\n🔗 ${videoUrl}`,
                        };
                    }
                } else {
                    msgContent = {
                        text: `🎬 *${i + 1}. ${title}*\n⏱️ Duration: ${duration}s\n🔗 ${videoUrl}`,
                    };
                }

                await sock.sendMessage(chatId, msgContent);
                await new Promise(r => setTimeout(r, 800));

            } catch (_) {}
        }

    } catch (error) {
        console.error('Error in pornCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch adult content. Please try again later.',
        }, { quoted: message });
    }
};

module.exports = pornCommand;
