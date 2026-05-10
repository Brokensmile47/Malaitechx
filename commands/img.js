// ============================================================
// 🖼️  img.js — Image search  (returns up to 5 images)
// ============================================================

const axios   = require('axios');
const cheerio = require('cheerio');

const MAX_IMAGES = 5;

const imgCommand = async (sock, chatId, message, query) => {
    try {
        if (!query || !query.trim()) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a search term.\n\nExample: *.img nairobi city*'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `🔍 Searching images for *${query}*... ⏳`
        }, { quoted: message });

        const imageUrls = [];

        // ── Method 1: Google Images ───────────────────────────────
        try {
            const res = await axios.get(
                `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&num=15`,
                {
                    timeout: 12000,
                    headers: {
                        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    }
                }
            );

            const html    = res.data;
            const matches = html.matchAll(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"/g);
            for (const m of matches) {
                const u = m[1];
                if (!u.includes('gstatic') && !u.includes('google') && !u.includes('favicon') && imageUrls.length < MAX_IMAGES + 5) {
                    imageUrls.push(u);
                }
            }

            if (imageUrls.length === 0) {
                const $ = cheerio.load(html);
                $('img').each((i, el) => {
                    const src = $(el).attr('src') || $(el).attr('data-src');
                    if (src && src.startsWith('http') && !src.includes('google') && imageUrls.length < MAX_IMAGES + 5) {
                        imageUrls.push(src);
                    }
                });
            }
        } catch (e) {
            console.error('Google scrape failed:', e.message);
        }

        // ── Method 2: DuckDuckGo (fallback) ──────────────────────
        if (imageUrls.length < MAX_IMAGES) {
            try {
                const init = await axios.get(
                    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
                    { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }
                );
                const vqd = (init.data.match(/vqd=([\d-]+)/) || [])[1];
                if (vqd) {
                    const imgs = await axios.get(
                        `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`,
                        { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://duckduckgo.com/' } }
                    );
                    for (const r of (imgs.data?.results || [])) {
                        if (r.image && imageUrls.length < MAX_IMAGES + 5) imageUrls.push(r.image);
                    }
                }
            } catch (e) { console.error('DDG fallback failed:', e.message); }
        }

        // ── Method 3: Bing (second fallback) ─────────────────────
        if (imageUrls.length < MAX_IMAGES) {
            try {
                const res = await axios.get(
                    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&count=15`,
                    { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' } }
                );
                const bm = res.data.matchAll(/"murl":"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/g);
                for (const m of bm) {
                    if (imageUrls.length < MAX_IMAGES + 5) imageUrls.push(m[1]);
                }
            } catch (e) { console.error('Bing fallback failed:', e.message); }
        }

        if (imageUrls.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❌ No images found for *${query}*. Try a different search term.`
            }, { quoted: message });
        }

        // ── Send up to MAX_IMAGES (5) ─────────────────────────────
        let sent = 0;
        for (const url of imageUrls.slice(0, MAX_IMAGES + 5)) {
            if (sent >= MAX_IMAGES) break;
            try {
                const imgRes = await axios.get(url, {
                    responseType:     'arraybuffer',
                    timeout:          15000,
                    headers:          { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.google.com/' },
                    maxContentLength: 10 * 1024 * 1024
                });

                const ct = imgRes.headers['content-type'] || 'image/jpeg';
                if (!ct.includes('image')) continue;
                const buf = Buffer.from(imgRes.data);
                if (buf.length < 1000) continue;

                await sock.sendMessage(chatId, {
                    image:   buf,
                    caption: sent === 0
                        ? `🖼️ *Results for:* ${query}\n\n📸 Image ${sent + 1} of ${MAX_IMAGES}\n⚡ Powered by *MALAITECHX*`
                        : `📸 Image ${sent + 1} of ${MAX_IMAGES}`,
                    mimetype: ct.split(';')[0]
                });

                sent++;
                await new Promise(r => setTimeout(r, 700));
            } catch (_) { /* skip broken image */ }
        }

        if (sent === 0) {
            await sock.sendMessage(chatId, {
                text: `❌ Found URLs but couldn't download images for *${query}*. Try a more specific term.`
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `✅ *Done!* Sent ${sent} image(s) for *${query}*\n⚡ *MALAITECHX*`
            });
        }

    } catch (error) {
        console.error('imgCommand error:', error.message);
        await sock.sendMessage(chatId, {
            text: '❌ Image search failed. Please try again.'
        }, { quoted: message });
    }
};

module.exports = imgCommand;
