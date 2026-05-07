// 🔞 porn.js — Adult content (sends real downloadable mp4 videos)

const axios = require('axios');
const cheerio = require('cheerio');

// ── Scrape XVideos for direct mp4 links ─────────────────────────────────────
const getXvideosLinks = async (count = 4) => {
    const results = [];
    try {
        const searchUrl = `https://www.xvideos.com/?k=short&sort=relevance&durf=1-3min`;
        const res = await axios.get(searchUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        const $ = cheerio.load(res.data);

        const videoPages = [];
        $('div.thumb-block').each((i, el) => {
            if (videoPages.length >= count * 3) return false;
            const link = $(el).find('a').first().attr('href');
            const title = $(el).find('a').first().attr('title') || `Video ${i + 1}`;
            const thumb = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            if (link && link.startsWith('/video')) {
                videoPages.push({ url: `https://www.xvideos.com${link}`, title, thumb });
            }
        });

        // For each page, get direct mp4
        for (const vid of videoPages) {
            if (results.length >= count) break;
            try {
                const pageRes = await axios.get(vid.url, {
                    timeout: 12000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
                    }
                });
                const html = pageRes.data;

                // XVideos stores mp4 in html5player setVideoUrlLow / setVideoUrlHigh
                const lowMatch = html.match(/setVideoUrlLow\(['"]([^'"]+)['"]\)/);
                const highMatch = html.match(/setVideoUrlHigh\(['"]([^'"]+)['"]\)/);
                const mp4Url = lowMatch?.[1] || highMatch?.[1];

                // Get duration from page
                const durMatch = html.match(/"duration"\s*:\s*"?(\d+)"?/);
                const duration = durMatch ? parseInt(durMatch[1]) : 999;

                // Only under 3 minutes
                if (mp4Url && duration <= 180) {
                    results.push({
                        title: vid.title,
                        mp4: mp4Url,
                        thumb: vid.thumb,
                        duration
                    });
                }
            } catch (_) {}

            await new Promise(r => setTimeout(r, 300));
        }
    } catch (e) {
        console.error('XVideos scrape error:', e.message);
    }
    return results;
};

// ── Scrape XNXX as fallback ──────────────────────────────────────────────────
const getXnxxLinks = async (count = 4) => {
    const results = [];
    try {
        const searchUrl = `https://www.xnxx.com/search/short/1`;
        const res = await axios.get(searchUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
            }
        });
        const $ = cheerio.load(res.data);

        const videoPages = [];
        $('div.thumb-block').each((i, el) => {
            if (videoPages.length >= count * 3) return false;
            const link = $(el).find('a').first().attr('href');
            const title = $(el).find('a').first().attr('title') || `Video ${i + 1}`;
            const thumb = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            if (link && (link.includes('/video-') || link.includes('/prof-video-'))) {
                videoPages.push({
                    url: link.startsWith('http') ? link : `https://www.xnxx.com${link}`,
                    title,
                    thumb
                });
            }
        });

        for (const vid of videoPages) {
            if (results.length >= count) break;
            try {
                const pageRes = await axios.get(vid.url, {
                    timeout: 12000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
                    }
                });
                const html = pageRes.data;

                const lowMatch = html.match(/setVideoUrlLow\(['"]([^'"]+)['"]\)/);
                const highMatch = html.match(/setVideoUrlHigh\(['"]([^'"]+)['"]\)/);
                const mp4Url = lowMatch?.[1] || highMatch?.[1];

                const durMatch = html.match(/"duration"\s*:\s*"?(\d+)"?/);
                const duration = durMatch ? parseInt(durMatch[1]) : 999;

                if (mp4Url && duration <= 180) {
                    results.push({
                        title: vid.title,
                        mp4: mp4Url,
                        thumb: vid.thumb,
                        duration
                    });
                }
            } catch (_) {}

            await new Promise(r => setTimeout(r, 300));
        }
    } catch (e) {
        console.error('XNXX scrape error:', e.message);
    }
    return results;
};

// ── Download video buffer ────────────────────────────────────────────────────
const downloadMp4 = async (url, referer) => {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 90000,
        maxContentLength: 64 * 1024 * 1024, // 64MB max
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
            'Referer': referer || 'https://www.xvideos.com/',
            'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'Range': 'bytes=0-'
        }
    });
    return Buffer.from(res.data);
};

// ── Main command ─────────────────────────────────────────────────────────────
const pornCommand = async (sock, chatId, message) => {
    try {
        await sock.sendMessage(chatId, {
            text: '🔞 *Searching for adult videos...*\n⏳ This may take up to 30 seconds, please wait.',
        }, { quoted: message });

        // Try XVideos first
        let videos = await getXvideosLinks(4);

        // Fallback to XNXX
        if (videos.length < 2) {
            await sock.sendMessage(chatId, {
                text: '🔄 Trying alternative source...',
            });
            const xnxx = await getXnxxLinks(4);
            videos = [...videos, ...xnxx].slice(0, 4);
        }

        if (videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Could not find any videos right now.\nPlease try again in a few minutes.',
            }, { quoted: message });
        }

        // Header
        await sock.sendMessage(chatId, {
            text: `🔞 *Adult Content — ${videos.length} Video(s)*\n\n⚠️ _For adults 18+ only_\n📥 _Videos sent as MP4 — tap & hold → Save to phone_\n\n⚡ Powered by *MALAITECHX*`,
        });

        let sentCount = 0;

        for (let i = 0; i < videos.length; i++) {
            const vid = videos[i];
            try {
                await sock.sendMessage(chatId, {
                    text: `⬇️ *Downloading video ${i + 1} of ${videos.length}...*\n🎬 ${vid.title.slice(0, 60)}\n⏱️ ${vid.duration}s`,
                });

                // Download thumbnail
                let thumbBuffer = null;
                if (vid.thumb) {
                    try {
                        const tRes = await axios.get(vid.thumb, {
                            responseType: 'arraybuffer',
                            timeout: 8000,
                            headers: { 'User-Agent': 'Mozilla/5.0' }
                        });
                        thumbBuffer = Buffer.from(tRes.data);
                    } catch (_) {}
                }

                // Download mp4 buffer
                const referer = vid.mp4.includes('xnxx') ? 'https://www.xnxx.com/' : 'https://www.xvideos.com/';
                const videoBuffer = await downloadMp4(vid.mp4, referer);

                // ✅ Send as real WhatsApp video — user can save directly
                await sock.sendMessage(chatId, {
                    video: videoBuffer,
                    mimetype: 'video/mp4',
                    fileName: `malaitechx_${i + 1}.mp4`,
                    caption: `🎬 *${i + 1}. ${vid.title.slice(0, 80)}*\n⏱️ Duration: ${vid.duration}s\n\n📥 _Tap & hold → Save to phone_\n⚡ *MALAITECHX*`,
                    ...(thumbBuffer ? { jpegThumbnail: thumbBuffer } : {})
                });

                sentCount++;
                // Delay between sends so WhatsApp doesn't throttle
                await new Promise(r => setTimeout(r, 2500));

            } catch (err) {
                console.error(`Failed video ${i + 1}:`, err.message);
                // Send page link as fallback if download fails
                try {
                    await sock.sendMessage(chatId, {
                        text: `⚠️ *Video ${i + 1} — Direct download failed*\n🎬 ${vid.title.slice(0, 60)}\n\n🔗 Open in browser to download:\n${vid.mp4}\n\n📥 Tap link → tap ⋮ → Download`,
                    });
                    sentCount++;
                } catch (_) {}
            }
        }

        await sock.sendMessage(chatId, {
            text: `✅ *Done! ${sentCount} video(s) sent*\n\n📥 Tap & hold any video → *Save to phone*\n⚡ Powered by *MALAITECHX*`,
        });

    } catch (error) {
        console.error('pornCommand error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch adult content. Please try again later.',
        }, { quoted: message });
    }
};

module.exports = pornCommand;
