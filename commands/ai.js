// ============================================================
// 🤖  ai.js — GPT and Gemini AI commands with multi-API fallback
// ============================================================

const axios = require('axios');

// ── GPT APIs ─────────────────────────────────────────────────
async function fetchGPT(query) {
    const enc = encodeURIComponent(query);
    const apis = [
        () => axios.get(`https://api.giftedtech.web.id/api/ai/gpt4o?apikey=gifted&q=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://api.siputzx.my.id/api/ai/gpt4o-mini?content=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://vapis.my.id/api/gpt?q=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://api.ryzendesu.vip/api/ai/chatgpt?text=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://zellapi.autos/ai/chatbot?text=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${enc}`, { timeout: 20000 }),
    ];

    for (const call of apis) {
        try {
            const res = await call();
            const d   = res.data;
            const ans =
                d?.result  || d?.answer || d?.message ||
                d?.data    || d?.content|| d?.response||
                d?.text    || d?.reply;
            if (ans && typeof ans === 'string' && ans.trim().length > 2) return ans.trim();
        } catch (_) {}
    }
    return null;
}

// ── Gemini APIs ───────────────────────────────────────────────
async function fetchGemini(query) {
    const enc = encodeURIComponent(query);
    const apis = [
        () => axios.get(`https://api.giftedtech.web.id/api/ai/geminiai?apikey=gifted&q=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://api.giftedtech.web.id/api/ai/geminiaipro?apikey=gifted&q=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://vapis.my.id/api/gemini?q=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?content=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://api.ryzendesu.vip/api/ai/gemini?text=${enc}`, { timeout: 20000 }),
        () => axios.get(`https://zellapi.autos/ai/chatbot?text=${enc}`, { timeout: 20000 }),
    ];

    for (const call of apis) {
        try {
            const res = await call();
            const d   = res.data;
            const ans =
                d?.result  || d?.answer || d?.message ||
                d?.data    || d?.content|| d?.response||
                d?.text    || d?.reply;
            if (ans && typeof ans === 'string' && ans.trim().length > 2) return ans.trim();
        } catch (_) {}
    }
    return null;
}

// ── Main command ──────────────────────────────────────────────
async function aiCommand(sock, chatId, message) {
    try {
        const fullText =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || '';

        if (!fullText.trim()) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a question.\n\nExample: *.gpt what is AI*\nExample: *.gemini write a poem*'
            }, { quoted: message });
        }

        const parts   = fullText.trim().split(/\s+/);
        const command = parts[0].toLowerCase();          // '.gpt' or '.gemini'
        const query   = parts.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: `❌ Please provide a question after *${command}*\n\nExample: *${command} write a basic HTML page*`
            }, { quoted: message });
        }

        // Show thinking reaction
        try {
            await sock.sendMessage(chatId, { react: { text: '🤖', key: message.key } });
        } catch (_) {}

        await sock.sendMessage(chatId, {
            text: `🤖 _Processing your request..._`
        }, { quoted: message });

        let answer = null;

        if (command === '.gpt') {
            answer = await fetchGPT(query);
        } else {
            // .gemini
            answer = await fetchGemini(query);
            // if gemini APIs all fail, fall back to GPT APIs
            if (!answer) answer = await fetchGPT(query);
        }

        if (!answer) {
            return await sock.sendMessage(chatId, {
                text: '❌ All AI sources are currently unavailable. Please try again in a few minutes.'
            }, { quoted: message });
        }

        const label = command === '.gpt' ? '🤖 GPT' : '✨ Gemini';
        await sock.sendMessage(chatId, {
            text: `${label}\n\n${answer}`
        }, { quoted: message });

    } catch (error) {
        console.error('AI Command Error:', error.message);
        await sock.sendMessage(chatId, {
            text: '❌ An error occurred. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = aiCommand;
