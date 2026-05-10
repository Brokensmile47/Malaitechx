// ============================================================
// 🔗  pair.js — Pairing Code Generator (Malai XD)
//     Uses the bot's own Baileys sock to request a real
//     WhatsApp pairing code for any valid number.
// ============================================================

const { sleep } = require('../lib/myfunc');

async function pairCommand(sock, chatId, message, q) {
    try {
        // ── 1. Parse number ──────────────────────────────────────────
        if (!q || !q.trim()) {
            return await sock.sendMessage(chatId, {
                text: [
                    '❌ *No number provided!*',
                    '',
                    '📌 *Usage:* `.pair <number>`',
                    '📌 *Example:* `.pair 254110670008`',
                    '',
                    '⚠️ Include country code, no + or spaces.'
                ].join('\n')
            }, { quoted: message });
        }

        const number = q.replace(/[^0-9]/g, '');

        if (number.length < 7 || number.length > 20) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Invalid number format!*\n\nPlease use full international format.\nExample: `254110670008`'
            }, { quoted: message });
        }

        const whatsappJid = number + '@s.whatsapp.net';

        // ── 2. Check if number is on WhatsApp ────────────────────────
        await sock.sendMessage(chatId, {
            text: `🔍 _Verifying number_ *+${number}*_..._`
        }, { quoted: message });

        let exists = false;
        try {
            const result = await sock.onWhatsApp(whatsappJid);
            exists = result?.[0]?.exists ?? false;
        } catch (_) {
            exists = true;
        }

        if (!exists) {
            return await sock.sendMessage(chatId, {
                text: `❌ *+${number}* is not registered on WhatsApp.\n\nPlease check the number and try again.`
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: '⏳ _Generating your pairing code..._'
        }, { quoted: message });

        await sleep(2000);

        // ── 3. Request pairing code from Baileys ─────────────────────
        let code;
        try {
            code = await sock.requestPairingCode(number);
        } catch (err) {
            console.error('requestPairingCode error:', err.message);
            return await sock.sendMessage(chatId, {
                text: [
                    '❌ *Failed to generate pairing code.*',
                    '',
                    'Possible reasons:',
                    '• The bot session is already fully paired',
                    '• WhatsApp rate-limited the request',
                    '• The number has 2FA/passkey enabled',
                    '',
                    'Please restart the bot in pairing-code mode and try again.'
                ].join('\n')
            }, { quoted: message });
        }

        // Sanitise to 8 uppercase alphanumeric chars
        const rawCode   = (code || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
        const formatted = rawCode.match(/.{1,4}/g)?.join('') || rawCode;

        // ── 4. Send beautifully formatted pairing card ────────────────
        const pairingMsg = [
            `🔗 *Pairing Code*`,
            `╭━ 🔐 𝘿𝙈𝙇–𝙈𝙄𝙉𝘽𝙊𝙏 • 𝙋𝘼𝙄𝙍𝙄𝙉𝙂 ━╮`,
            `┃ 📱 Number : ${number}`,
            `┃ 🔑 Code   : ${formatted}`,
            `┃ 🟢 Status : ACTIVE`,
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            ``,
            `📌 *How to link your device*`,
            `1️⃣  Open WhatsApp → Settings`,
            `2️⃣  Tap *Linked Devices*`,
            `3️⃣  Choose *Link a Device*`,
            `4️⃣  Enter the pairing code above`,
            ``,
            `⚠️ This code is temporary. Pair immediately.`,
            ``,
            `Powered By *Malai XD*`
        ].join('\n');

        await sock.sendMessage(chatId, { text: pairingMsg }, { quoted: message });

    } catch (error) {
        console.error('pairCommand error:', error.message);
        await sock.sendMessage(chatId, {
            text: '❌ An error occurred while generating the pairing code.\nPlease try again later.'
        }, { quoted: message });
    }
}

module.exports = pairCommand;
