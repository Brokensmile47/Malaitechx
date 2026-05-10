// ============================================================
// 🖼️  img.js — Image search  (Malai XD)
//     Multi-API with reliable fallbacks so images always work
// ============================================================

const axios = require('axios');

const MAX_IMAGES = 5;

// ── Fetch image URLs from multiple sources ────────────────────────────────────
async function searchImages(query) {
    const results = [];
    const enc = encodeURIComponent(query);

    // ── Source 1: DuckDuckGo Images (most reliable, no key needed) ───────────
    try {
        const initRes = await axios.get(
            `https://duckduckgo.com/?q=${enc}&iax=images&ia=images`,
            { timeout: 12000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
        );
        const vqd = (initRes.data.match(/vqd=([\d-]+)/) || [])[1];
        if (vqd) {
            const imgRes = await axios.get(
                `https://duckduckgo.com/i.js?q=${enc}&vqd=${vqd}&f=,,,&p=1&l=us-en`,
                {
                    timeout: 12000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Referer': 'https://duckduckgo.com/',
                        'Accept': 'application/json'
                    }
                }
            );
            for (const r of (imgRes.data?.results || [])) {
                if (r.image && results.length < MAX_IMAGES + 5) results.push(r.image);
            }
        }
    } catch (e) { console.error('DDG image search failed:', e.message); }

    // ── Source 2: Bing Images ─────────────────────────────────────────────────
    if (results.length < MAX_IMAGES) {
        try {
            const res = await axios.get(
                `https://www.bing.com/images/search?q=${enc}&count=20&first=1&FORM=HDRSC2`,
                {
                    timeout: 12000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9'
                    }
                }
            );
            const matches = res.data.matchAll(/"murl":"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/g);
            for (const m of matches) {
                if (results.length < MAX_IMAGES + 5 && !results.includes(m[1])) {
                    results.push(m[1]);
                }
            }
        } catch (e) { console.error('Bing fallback failed:', e.message); }
    }

    // ── Source 3: Pixabay (free public API, no key for basic hits) ───────────
    if (results.length < MAX_IMAGES) {
        try {
            const res = await axios.get(
                `https://pixabay.com/api/?key=47614088-33c9e7c97bc2b8b7b1bef5c97&q=${enc}&image_type=photo&per_page=10&safesearch=true`,
                { timeout: 12000 }
            );
            for (const hit of (res.data?.hits || [])) {
                if (hit.webformatURL && results.length < MAX_IMAGES + 5) {
                    results.push(hit.webformatURL);
                }
            }
        } catch (e) { console.error('Pixabay fallback failed:', e.message); }
    }

    // ── Source 4: Unsplash (public CDN search, no key) ───────────────────────
    if (results.length < MAX_IMAGES) {
        try {
            const res = await axios.get(
                `https://unsplash.com/napi/search/photos?query=${enc}&per_page=10&xp=search-frequency-doubling%3Acontrol`,
                {
                    timeout: 12000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Accept': 'application/json',
                        'Authorization': 'Client-ID 60c0f3dca5d7f6e8cc7b0af1e89f1c6e4e2c0c1b' // public demo key
                    }
                }
            );
            for (const photo of (res.data?.results || [])) {
                const url = photo?.urls?.regular || photo?.urls?.small;
                if (url && results.length < MAX_IMAGES + 5) results.push(url);
            }
        } catch (e) { console.error('Unsplash fallback failed:', e.message); }
    }

    return results;
}

// ── Download and verify an image buffer ──────────────────────────────────────
async function downloadImage(url) {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://www.google.com/'
        },
        maxContentLength: 15 * 1024 * 1024
    });
    const ct = res.headers['content-type'] || 'image/jpeg';
    if (!ct.includes('image')) throw new Error('Not an image');
    const buf = Buffer.from(res.data);
    if (buf.length < 800) throw new Error('Image too small');
    return { buf, mimetype: ct.split(';')[0] };
}

// ── Main command ──────────────────────────────────────────────────────────────
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

        const imageUrls = await searchImages(query);

        if (imageUrls.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❌ No images found for *${query}*. Try a different search term.`
            }, { quoted: message });
        }

        let sent = 0;
        for (const url of imageUrls) {
            if (sent >= MAX_IMAGES) break;
            try {
                const { buf, mimetype } = await downloadImage(url);

                await sock.sendMessage(chatId, {
                    image: buf,
                    caption: sent === 0
                        ? `🖼️ *Results for:* ${query}\n\n📸 Image ${sent + 1} of ${Math.min(imageUrls.length, MAX_IMAGES)}\n⚡ Powered by *Malai XD*`
                        : `📸 Image ${sent + 1} of ${Math.min(imageUrls.length, MAX_IMAGES)} • *Malai XD*`,
                    mimetype
                });

                sent++;
                await new Promise(r => setTimeout(r, 700));
            } catch (_) { /* skip broken URLs */ }
        }

        if (sent === 0) {
            await sock.sendMessage(chatId, {
                text: `❌ Found image URLs but couldn't download them for *${query}*.\nTry a more specific search term.`
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `✅ *Done!* Sent ${sent} image(s) for *${query}*\n⚡ *Malai XD*`
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
