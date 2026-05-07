/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Image Search Command
 * Searches Google → Bing → DuckDuckGo → Pixabay (4 fallbacks)
 */

const axios = require('axios');

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

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
};

// ── Google Images scraper ─────────────────────────────────────────────────────
async function searchGoogle(query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=active&num=10`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const urls = [];
    const patterns = [
        /"ou":"(https?:\/\/(?!encrypted)[^"]{20,}\.(?:jpg|jpeg|png|webp))"/gi,
        /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]/gi,
        /imgurl=(https?[^&"]+\.(?:jpg|jpeg|png|webp))/gi,
    ];
    for (const pat of patterns) {
        let m;
        while ((m = pat.exec(data)) !== null) {
            try {
                const u = decodeURIComponent(m[1]);
                if (u.startsWith('http') && !urls.includes(u)) urls.push(u);
                if (urls.length >= 10) break;
            } catch (_) {}
        }
        if (urls.length >= 10) break;
    }
    return urls;
}

// ── Bing Images scraper ───────────────────────────────────────────────────────
async function searchBing(query) {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&safeSearch=Moderate&count=10`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const urls = [];
    const pattern = /"murl":"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi;
    let m;
    while ((m = pattern.exec(data)) !== null) {
        if (!urls.includes(m[1])) urls.push(m[1]);
        if (urls.length >= 10) break;
    }
    return urls;
}

// ── DuckDuckGo Images ─────────────────────────────────────────────────────────
async function searchDDG(query) {
    // Get vqd token first
    const init = await axios.get(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
        headers: HEADERS, timeout: 10000
    });
    const vqdMatch = init.data.match(/vqd=([\d-]+)/);
    if (!vqdMatch) throw new Error('No vqd token');
    const vqd = vqdMatch[1];

    const { data } = await axios.get(
        `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&p=1&s=0&u=bing&f=,,,&l=us-en`,
        { headers: { ...HEADERS, Referer: 'https://duckduckgo.com/' }, timeout: 10000 }
    );
    const results = data?.results || [];
    return results.map(r => r.image).filter(Boolean).slice(0, 10);
}

// ── Pixabay free API ──────────────────────────────────────────────────────────
async function searchPixabay(query) {
    // Free API — no key needed for basic usage
    const keys = [
        '43869945-b7ef7e8e3e93a2c80b5e9c2a1',
        '39187442-e40eae44f56c9a1a53f5cb3b4',
    ];
    for (const key of keys) {
        try {
            const { data } = await axios.get(
                `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&per_page=6&safesearch=true`,
                { timeout: 10000 }
            );
            const hits = data?.hits || [];
            if (hits.length > 0) return hits.map(h => h.webformatURL).filter(Boolean);
        } catch (_) {}
    }
    return [];
}

// ── Download image buffer ─────────────────────────────────────────────────────
async function downloadImage(url) {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: { ...HEADERS, Referer: 'https://www.google.com/' }
    });
    const buf = Buffer.from(res.data);
    if (buf.length < 3000) throw new Error('Too small');
    return buf;
}

// ── Main command ──────────────────────────────────────────────────────────────
const imgCommand = async (sock, chatId, message, query) => {
    try {
        if (!query || query.trim() === '') {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide a search term.\nExample: *.img uhuru kenyatta*',
                ...channelInfo
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `🔍 Searching images for *${query}*...`,
            ...channelInfo
        }, { quoted: message });

        let imageUrls = [];
        let source = '';

        // Try each engine in order
        const engines = [
            { name: 'Google',    fn: () => searchGoogle(query) },
            { name: 'Bing',      fn: () => searchBing(query) },
            { name: 'DuckDuckGo',fn: () => searchDDG(query) },
            { name: 'Pixabay',   fn: () => searchPixabay(query) },
        ];

        for (const engine of engines) {
            try {
                const results = await engine.fn();
                if (results.length > 0) {
                    imageUrls = results;
                    source = engine.name;
                    console.log(`✅ Images found via ${engine.name}: ${results.length}`);
                    break;
                }
            } catch (e) {
                console.log(`⚠️ ${engine.name} failed: ${e.message}`);
            }
        }

        if (imageUrls.length === 0) {
            return sock.sendMessage(chatId, {
                text: `❌ No images found for *${query}*.\n\nTry a different search term or be more specific.`,
                ...channelInfo
            }, { quoted: message });
        }

        // Shuffle and pick up to 4 images
        const shuffled = imageUrls.sort(() => Math.random() - 0.5).slice(0, 4);
        let sent = 0;

        for (let i = 0; i < shuffled.length; i++) {
            const url = shuffled[i];
            try {
                const buffer = await downloadImage(url);
                await sock.sendMessage(chatId, {
                    image: buffer,
                    caption: i === 0
                        ? `🖼️ *${query}*\n🔍 Source: ${source}\n\n✨ _Made By Kimani Samuel_\n📢 ${global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p'}`
                        : '',
                    ...channelInfo
                });
                sent++;
                if (i < shuffled.length - 1) await new Promise(r => setTimeout(r, 500));
            } catch (_) {}
        }

        if (sent === 0) {
            await sock.sendMessage(chatId, {
                text: `❌ Found images but couldn't download them. Try again or use a different query.`,
                ...channelInfo
            }, { quoted: message });
        }

    } catch (error) {
        console.error('imgCommand error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Image search failed. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
};

module.exports = imgCommand;
