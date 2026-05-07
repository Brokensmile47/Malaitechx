// 🖼️ img.js — Image search using Google Images via cheerio scraping

const axios = require('axios');
const cheerio = require('cheerio');

const imgCommand = async (sock, chatId, message, query) => {
    try {
        if (!query || query.trim() === '') {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a search term.\n\nExample: *.img uhuru kenyatta*',
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `🔍 Searching Google Images for *${query}*...\nPlease wait ⏳`,
        }, { quoted: message });

        const imageUrls = [];

        // ── Method 1: Google Images scrape ──────────────────────────
        try {
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&num=10`;
            const res = await axios.get(googleUrl, {
                timeout: 12000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                }
            });

            const html = res.data;

            // Extract image URLs from Google's response
            const matches = html.matchAll(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)",\d+,\d+\]/g);
            for (const m of matches) {
                const url = m[1];
                if (!url.includes('gstatic') && !url.includes('google') && imageUrls.length < 8) {
                    imageUrls.push(url);
                }
            }

            // Also try data:image base64 pattern fallback
            if (imageUrls.length === 0) {
                const $ = cheerio.load(html);
                $('img').each((i, el) => {
                    const src = $(el).attr('src') || $(el).attr('data-src');
                    if (src && src.startsWith('http') && !src.includes('google') && imageUrls.length < 8) {
                        imageUrls.push(src);
                    }
                });
            }
        } catch (e) {
            console.error('Google scrape failed:', e.message);
        }

        // ── Method 2: DuckDuckGo Image API (fallback) ───────────────
        if (imageUrls.length < 3) {
            try {
                // Step 1: get vqd token
                const ddgInit = await axios.get(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
                    timeout: 10000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });
                const vqdMatch = ddgInit.data.match(/vqd=([\d-]+)/);
                if (vqdMatch) {
                    const vqd = vqdMatch[1];
                    // Step 2: fetch images
                    const ddgImages = await axios.get(
                        `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`,
                        {
                            timeout: 10000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                                'Referer': 'https://duckduckgo.com/'
                            }
                        }
                    );
                    const results = ddgImages.data?.results || [];
                    for (const r of results) {
                        if (r.image && imageUrls.length < 8) {
                            imageUrls.push(r.image);
                        }
                    }
                }
            } catch (e) {
                console.error('DDG fallback failed:', e.message);
            }
        }

        // ── Method 3: Bing Image Search scrape (second fallback) ────
        if (imageUrls.length < 3) {
            try {
                const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&count=10`;
                const bingRes = await axios.get(bingUrl, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
                    }
                });
                const bingMatches = bingRes.data.matchAll(/"murl":"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/g);
                for (const m of bingMatches) {
                    if (imageUrls.length < 8) imageUrls.push(m[1]);
                }
            } catch (e) {
                console.error('Bing fallback failed:', e.message);
            }
        }

        if (imageUrls.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❌ No images found for *${query}*.\nTry a different search term.`,
            }, { quoted: message });
        }

        // Send up to 4 images
        let sent = 0;
        const toSend = imageUrls.slice(0, 6); // try up to 6 in case some fail

        for (const url of toSend) {
            if (sent >= 4) break;
            try {
                const imgRes = await axios.get(url, {
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://www.google.com/'
                    },
                    maxContentLength: 10 * 1024 * 1024 // 10MB max per image
                });

                const contentType = imgRes.headers['content-type'] || 'image/jpeg';
                if (!contentType.includes('image')) continue;

                const buffer = Buffer.from(imgRes.data);
                if (buffer.length < 1000) continue; // skip tiny/broken images

                await sock.sendMessage(chatId, {
                    image: buffer,
                    caption: sent === 0
                        ? `🖼️ *Results for:* ${query}\n\n📸 Image ${sent + 1} of 4\n⚡ Powered by *MALAITECHX*`
                        : `📸 Image ${sent + 1} of 4`,
                    mimetype: contentType.split(';')[0]
                });

                sent++;
                await new Promise(r => setTimeout(r, 700));
            } catch (_) {
                // skip broken image and try next
            }
        }

        if (sent === 0) {
            await sock.sendMessage(chatId, {
                text: `❌ Found URLs but couldn't download images for *${query}*.\nTry a more specific search term.`,
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `✅ *Done!* Sent ${sent} image(s) for *${query}*\n⚡ Powered by *MALAITECHX*`,
            });
        }

    } catch (error) {
        console.error('Error in imgCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Image search failed. Please try again.',
        }, { quoted: message });
    }
};

module.exports = imgCommand;
