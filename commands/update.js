/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Update Command
 * Pulls latest updates from GitHub repo and restarts the bot
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');

const REPO_URL = 'https://github.com/Brokensmile47/Malaitechx.git';
const ROOT = process.cwd();

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

async function updateCommand(sock, chatId, message) {
    try {
        // Notify user that update is starting
        await sock.sendMessage(chatId, {
            text: `🔄 *Checking for updates...*\n\n📦 Repo: ${REPO_URL}`,
            ...channelInfo
        }, { quoted: message });

        // Step 1: Check if this is a git repo
        try {
            await execPromise('git status', { cwd: ROOT });
        } catch (_) {
            // Not a git repo — initialize it
            await sock.sendMessage(chatId, {
                text: '⚙️ Initializing git repository...',
                ...channelInfo
            }, { quoted: message });
            await execPromise(`git init && git remote add origin ${REPO_URL}`, { cwd: ROOT });
        }

        // Step 2: Fetch latest changes
        await sock.sendMessage(chatId, {
            text: '📡 *Fetching latest changes from GitHub...*',
            ...channelInfo
        }, { quoted: message });

        let fetchOut = '';
        try {
            const { stdout } = await execPromise('git fetch origin', { cwd: ROOT, timeout: 30000 });
            fetchOut = stdout;
        } catch (e) {
            throw new Error(`Git fetch failed: ${e.message}`);
        }

        // Step 3: Check if there are any updates
        let behindCount = 0;
        try {
            const { stdout } = await execPromise('git rev-list HEAD..origin/main --count', { cwd: ROOT });
            behindCount = parseInt(stdout.trim()) || 0;
        } catch (_) {
            try {
                const { stdout } = await execPromise('git rev-list HEAD..origin/master --count', { cwd: ROOT });
                behindCount = parseInt(stdout.trim()) || 0;
            } catch (_) {}
        }

        if (behindCount === 0) {
            return sock.sendMessage(chatId, {
                text: `✅ *Bot is already up to date!*\n\nNo new updates available.\n\n*Made By Kimani Samuel*\n📢 ${global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p'}`,
                ...channelInfo
            }, { quoted: message });
        }

        // Step 4: Pull the updates
        await sock.sendMessage(chatId, {
            text: `📥 *Found ${behindCount} new update(s)! Pulling...*`,
            ...channelInfo
        }, { quoted: message });

        let pullOutput = '';
        try {
            // Try main branch first, then master
            try {
                const { stdout } = await execPromise('git pull origin main --no-rebase', { cwd: ROOT, timeout: 60000 });
                pullOutput = stdout;
            } catch (_) {
                const { stdout } = await execPromise('git pull origin master --no-rebase', { cwd: ROOT, timeout: 60000 });
                pullOutput = stdout;
            }
        } catch (e) {
            // Force pull if there are conflicts
            await execPromise('git reset --hard HEAD', { cwd: ROOT });
            try {
                const { stdout } = await execPromise('git pull origin main --force', { cwd: ROOT, timeout: 60000 });
                pullOutput = stdout;
            } catch (_) {
                await execPromise('git pull origin master --force', { cwd: ROOT, timeout: 60000 });
            }
        }

        // Step 5: Install any new dependencies
        await sock.sendMessage(chatId, {
            text: '📦 *Installing dependencies...*',
            ...channelInfo
        }, { quoted: message });

        try {
            await execPromise('npm install --production', { cwd: ROOT, timeout: 120000 });
        } catch (e) {
            console.warn('npm install warning:', e.message);
        }

        // Step 6: Notify and restart
        await sock.sendMessage(chatId, {
            text: `✅ *Update Successful!*\n\n📋 Changes pulled: *${behindCount}*\n🔄 Restarting bot...\n\n*Made By Kimani Samuel*\n📢 ${global.channelLink || 'https://www.whatsapp.com/channel/0029Vb7yILLBadmWeKQso40p'}`,
            ...channelInfo
        }, { quoted: message });

        // Small delay so the message sends before restart
        await new Promise(r => setTimeout(r, 2000));

        // Restart — process.exit(1) triggers panel/pm2 auto-restart
        console.log('🔄 Restarting bot after update...');
        process.exit(0);

    } catch (err) {
        console.error('Update error:', err);
        await sock.sendMessage(chatId, {
            text: `❌ *Update Failed!*\n\nError: ${err.message}\n\nTry manually:\n\`\`\`\ngit pull origin main\nnpm install\nnode index.js\n\`\`\``,
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = updateCommand;
