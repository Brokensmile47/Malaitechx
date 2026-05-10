async function handleStatusAndViewOnce(sock, message) {

    const owner =
        sock.user.id.split(':')[0] + '@s.whatsapp.net';

    /**
     * STATUS DETECTION
     */
    if (message.key.remoteJid === 'status@broadcast') {

        const sender = message.key.participant;

        if (message.message?.imageMessage) {

            await sock.sendMessage(owner, {
                text: `🖼️ Status Image detected from @${sender.split('@')[0]}`,
                mentions: [sender]
            });
        }

        if (message.message?.videoMessage) {

            await sock.sendMessage(owner, {
                text: `🎥 Status Video detected from @${sender.split('@')[0]}`,
                mentions: [sender]
            });
        }
    }

    /**
     * VIEW ONCE DETECTION
     */
    const viewOnce =
        message.message?.viewOnceMessageV2?.message ||
        message.message?.viewOnceMessage?.message;

    if (viewOnce) {

        const sender =
            message.key.participant ||
            message.key.remoteJid;

        if (viewOnce.imageMessage) {

            await sock.sendMessage(owner, {
                text: `👁️ View Once Image detected from @${sender.split('@')[0]}`,
                mentions: [sender]
            });
        }

        if (viewOnce.videoMessage) {

            await sock.sendMessage(owner, {
                text: `🎥 View Once Video detected from @${sender.split('@')[0]}`,
                mentions: [sender]
            });
        }
    }
}

module.exports = {
    handleStatusAndViewOnce
};
