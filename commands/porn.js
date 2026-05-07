// 🔞 porn.js — Adult content command (sends actual downloadable videos)

const axios = require('axios');

// Helper: get the direct .mp4 embed URL from RedTube video page
const getDirectVideoUrl = async (videoPageUrl) => {
    try {
        const res = await axios.get(videoPageUrl, {
            timeout: 12000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
            }
        });
        const html = res.data;

        // Try to extract mp4 source from page HTML
        const mp4Match = html.match(/["']?(https?:\/\/[^"'\s]+\.mp4[^"'\s]*)["']?/);
        if (mp4Match) return mp4Match[1];

        // Try videoUrl pattern used by RedTube
        const urlMatch = html.match(/videoUrl['":\s]+['"]([^'"]+)['"]/);
        if (urlMatch) return urlMatch[1];

        return null;
    } catch (_) {
        return null;
    }
};

// Helper: download video buffer
const downloadVideo = async (url) => {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxContentLength: 50 * 1024 * 1024, // 50MB max
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
            'Referer': 'https://www.redtube.com/'
        }
    });
    return Buffer.from(res.data);
};

const pornCommand = async (sock, chatId, message) => {
    try {
        await sock.sendMessage(chatId, {
            text: '🔞 *Fetching adult videos...*\n\n⏳ Please wait, downloading videos for you to save...',
        }, { quoted: message });

        // RedTube public API — no key needed
        const apiUrl = 'https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&thumbsize=big&period=week&ordering=mostviewed&limit=30&max_duration=180';

        const response = await axios.get(apiUrl, { timeout: 15000 });
        const videos = response.data?.videos;

        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Could not fetch adult content right now. Try again later.',
            }, { quoted: message });
        }

        // Filter videos under 3 minutes (180 seconds)
        const candidates = videos
            .map(v => v.video)
            .filter(v => v && parseInt(v.duration) <= 180 && v.url);

        if (candidates.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ No short videos found right now. Try again later.',
            }, { quoted: message });
        }

        // Header
        await sock.sendMessage(chatId, {
            text: `🔞 *Adult Content — 4 Videos*\n\n⚠️ _For adults 18+ only_\n📥 _Videos sent directly — tap & hold to save_\n\n⚡ Powered by *MALAITECHX*`,
        });

        let sentCount = 0;

        for (const vid of candidates) {
            if (sentCount >= 4) break;

            const title = vid.title || `Video ${sentCount + 1}`;
            const duration = vid.duration || 'N/A';
            const thumbUrl = vid.default_thumb || vid.thumbs?.[0]?.src || '';
            const pageUrl = vid.url;

            try {
                await sock.sendMessage(chatId, {
                    text: `⬇️ *Downloading video ${sentCount + 1} of 4...*\n🎬 ${title}\n⏱️ ${duration}s`,
                });

                // Try to resolve direct mp4 URL
                let directUrl = null;

                // Try scraping page for mp4 link
                directUrl = await getDirectVideoUrl(pageUrl);

                if (directUrl) {
                    try {
                        const videoBuffer = await downloadVideo(directUrl);

                        // Get thumbnail
                        let thumbBuffer = null;
                        if (thumbUrl) {
                            try {
                                const thumbRes = await axios.get(thumbUrl, { responseType: 'arraybuffer', timeout: 8000 });
                                thumbBuffer = Buffer.from(thumbRes.data);
                            } catch (_) {}
                        }

                        // ✅ Send as actual video — user can tap & hold → Save
                        await sock.sendMessage(chatId, {
                            video: videoBuffer,
                            caption: `🎬 *${sentCount + 1}. ${title}*\n⏱️ Duration: ${duration}s\n\n📥 _Tap & hold → Save to phone_\n⚡ *MALAITECHX*`,
                            mimetype: 'video/mp4',
                            fileName: `malaitechx_video_${sentCount + 1}.mp4`,
                            ...(thumbBuffer ? { jpegThumbnail: thumbBuffer } : {})
                        });

                        sentCount++;
                        await new Promise(r => setTimeout(r, 2000));
                        continue;
                    } catch (_) {
                        // Download failed, fall through to link fallback
                    }
                }

                // ⚠️ Fallback: send thumbnail + download link if buffer fails
                let thumbBuffer = null;
                if (thumbUrl) {
                    try {
                        const thumbRes = await axios.get(thumbUrl, { responseType: 'arraybuffer', timeout: 8000 });
                        thumbBuffer = Buffer.from(thumbRes.data);
                    } catch (_) {}
                }

                if (thumbBuffer) {
                    await sock.sendMessage(chatId, {
                        image: thumbBuffer,
                        caption: `🎬 *${sentCount + 1}. ${title}*\n⏱️ Duration: ${duration}s\n\n🔗 *Tap to open & download:*\n${pageUrl}\n\n📥 Open → tap ⋮ → Download\n⚡ *MALAITECHX*`,
                    });
                } else {
                    await sock.sendMessage(chatId, {
                        text: `🎬 *${sentCount + 1}. ${title}*\n⏱️ Duration: ${duration}s\n\n🔗 *Tap to open & download:*\n${pageUrl}\n\n📥 Open → tap ⋮ → Download\n⚡ *MALAITECHX*`,
                    });
                }

                sentCount++;
                await new Promise(r => setTimeout(r, 1500));

            } catch (err) {
                console.error(`Skipping video ${sentCount + 1}:`, err.message);
            }
        }

        if (sentCount === 0) {
            await sock.sendMessage(chatId, {
                text: '❌ Could not process any videos. Please try again later.',
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `✅ *Done!* ${sentCount} video(s) sent.\n\n📥 Tap & hold any video → *Save to phone*\n⚡ Powered by *MALAITECHX*`,
            });
        }

    } catch (error) {
        console.error('Error in pornCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch adult content. Please try again later.',
        }, { quoted: message });
    }
};

module.exports = pornCommand;
