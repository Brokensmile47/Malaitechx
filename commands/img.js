// 🖼️ img.js — Fetch images based on search query

const axios = require('axios');

const imgCommand = async (sock, chatId, message, query) => {
    try {
        if (!query || query.trim() === '') {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a search term.\nExample: *.img uhuru kenyatta*',
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `🔍 Searching for images of *${query}*... Please wait.`,
        }, { quoted: message });

        // Use DuckDuckGo image search API (no key needed)
        const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=4&client_id=s9P0bGFSKMoiqmHhfJkSWPPFLPPSN9M2YBx3RM6yJdI`;

        let imageUrls = [];

        try {
            const response = await axios.get(searchUrl, { timeout: 8000 });
            if (response.data?.results?.length > 0) {
                imageUrls = response.data.results.slice(0, 4).map(r => r.urls?.regular).filter(Boolean);
            }
        } catch (_) {}

        // Fallback: use Pixabay free API
        if (imageUrls.length === 0) {
            try {
                const pixabay = await axios.get(
                    `https://pixabay.com/api/?key=43869945-b7ef7e8e3e93a2c80b5e9c2a1&q=${encodeURIComponent(query)}&image_type=photo&per_page=4`,
                    { timeout: 8000 }
                );
                if (pixabay.data?.hits?.length > 0) {
                    imageUrls = pixabay.data.hits.slice(0, 4).map(h => h.webformatURL).filter(Boolean);
                }
            } catch (_) {}
        }

        if (imageUrls.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❌ No images found for *${query}*. Try a different search term.`,
            }, { quoted: message });
        }

        // Send each image
        let sent = 0;
        for (const url of imageUrls) {
            try {
                const imgRes = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
                const buffer = Buffer.from(imgRes.data);
                await sock.sendMessage(chatId, {
                    image: buffer,
                    caption: sent === 0 ? `🖼️ *Results for:* ${query}\n\n⚡ Powered by *MALAITECHX*` : '',
                });
                sent++;
                // Small delay between images
                await new Promise(r => setTimeout(r, 500));
            } catch (_) {}
        }

        if (sent === 0) {
            await sock.sendMessage(chatId, {
                text: `❌ Could not download images for *${query}*. Try again later.`,
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Error in imgCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch images. Please try again.',
        }, { quoted: message });
    }
};

module.exports = imgCommand;
