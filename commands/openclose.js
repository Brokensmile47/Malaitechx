// 🔓 open.js / close.js — Open or close group for messaging

const openGroupCommand = async (sock, chatId, senderId, message) => {
    try {
        // Only works in groups
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in groups.',
            }, { quoted: message });
        }

        // Open group — all participants can send messages
        await sock.groupSettingUpdate(chatId, 'not_announcement');

        await sock.sendMessage(chatId, {
            text: `╔════════════════════╗
║     🔓 GROUP OPENED
╚════════════════════╝

✅ The group has been *opened* successfully!
👥 All members can now send messages.

⚡ Powered by *MALAITECHX*`,
        }, { quoted: message });

    } catch (error) {
        console.error('Error in openGroupCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to open group. Make sure I am an admin.',
        }, { quoted: message });
    }
};

const closeGroupCommand = async (sock, chatId, senderId, message) => {
    try {
        // Only works in groups
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in groups.',
            }, { quoted: message });
        }

        // Close group — only admins can send messages
        await sock.groupSettingUpdate(chatId, 'announcement');

        await sock.sendMessage(chatId, {
            text: `╔════════════════════╗
║     🔒 GROUP CLOSED
╚════════════════════╝

✅ The group has been *closed* successfully!
🔇 Only admins can now send messages.

⚡ Powered by *MALAITECHX*`,
        }, { quoted: message });

    } catch (error) {
        console.error('Error in closeGroupCommand:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to close group. Make sure I am an admin.',
        }, { quoted: message });
    }
};

module.exports = { openGroupCommand, closeGroupCommand };
