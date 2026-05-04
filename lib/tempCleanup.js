/**
 * ✨ Made By Kɪᴍᴀɴɪ Samuel 💎 - Storage Manager
 * Keeps the bot running forever without filling up disk
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = process.cwd();

// Folders to auto-clean
const CLEAN_TARGETS = [
    { dir: path.join(ROOT, 'temp'),          maxAgeMs: 5  * 60 * 1000  }, // 5 mins
    { dir: path.join(ROOT, 'tmp'),           maxAgeMs: 5  * 60 * 1000  }, // 5 mins
    { dir: path.join(ROOT, 'downloads'),     maxAgeMs: 10 * 60 * 1000  }, // 10 mins
    { dir: path.join(ROOT, 'media'),         maxAgeMs: 15 * 60 * 1000  }, // 15 mins
    { dir: path.join(ROOT, 'cache'),         maxAgeMs: 30 * 60 * 1000  }, // 30 mins
];

// Files that must NEVER be deleted
const PROTECTED = [
    'autorecord.json', 'areact.json', 'autotyping.json',
    'autoread.json', 'messageCount.json', 'settings.json',
    'banned.json', 'warns.json', 'antidelete.json',
    'antilink.json', 'antibadword.json', 'antitag.json',
    'mode.json', 'sudo.json', 'pmblocker.json',
    'creds.json', 'app-state-sync-key', 'session'
];

function isProtected(filePath) {
    return PROTECTED.some(p => filePath.includes(p));
}

// ─── Clean a single directory ─────────────────────────────────────────────────
function cleanDir(dirPath, maxAgeMs) {
    if (!fs.existsSync(dirPath)) return;

    let cleaned = 0;
    let freedBytes = 0;

    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            if (isProtected(filePath)) continue;

            try {
                const stat = fs.statSync(filePath);
                if (stat.isFile() && (Date.now() - stat.mtimeMs) > maxAgeMs) {
                    freedBytes += stat.size;
                    fs.unlinkSync(filePath);
                    cleaned++;
                }
            } catch (_) {}
        }
    } catch (_) {}

    if (cleaned > 0) {
        const freed = (freedBytes / 1024 / 1024).toFixed(2);
        console.log(`🧹 Cleaned ${cleaned} files (${freed} MB freed) from ${path.basename(dirPath)}/`);
    }
}

// ─── Full storage sweep ───────────────────────────────────────────────────────
function runCleanup() {
    for (const target of CLEAN_TARGETS) {
        cleanDir(target.dir, target.maxAgeMs);
    }
}

// ─── Get disk usage stats ─────────────────────────────────────────────────────
function getDiskStats(callback) {
    exec('df -h ' + ROOT, (err, stdout) => {
        if (err || !stdout) return callback(null);
        const lines = stdout.trim().split('\n');
        if (lines.length < 2) return callback(null);
        const parts = lines[1].split(/\s+/);
        callback({
            total: parts[1],
            used: parts[2],
            available: parts[3],
            usePercent: parts[4]
        });
    });
}

// ─── Emergency cleanup (when disk is critically full) ─────────────────────────
function emergencyCleanup() {
    getDiskStats((stats) => {
        if (!stats) return;
        const pct = parseInt(stats.usePercent);
        if (pct > 85) {
            console.warn(`⚠️ Disk ${stats.usePercent} full — running emergency cleanup!`);
            // Wipe everything in temp/tmp regardless of age
            for (const target of CLEAN_TARGETS) {
                cleanDir(target.dir, 0); // 0ms = delete everything
            }
            console.log(`✅ Emergency cleanup done. Disk: ${stats.used}/${stats.total}`);
        }
    });
}

// ─── Delete a file safely after a delay ──────────────────────────────────────
function deleteAfter(filePath, delayMs = 30000) {
    setTimeout(() => {
        try {
            if (fs.existsSync(filePath) && !isProtected(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (_) {}
    }, delayMs);
}

// ─── Ensure all clean dirs exist ─────────────────────────────────────────────
function initDirs() {
    for (const target of CLEAN_TARGETS) {
        if (!fs.existsSync(target.dir)) {
            fs.mkdirSync(target.dir, { recursive: true });
        }
    }
}

// ─── Start the storage manager ────────────────────────────────────────────────
function startStorageManager() {
    initDirs();

    // Run immediately on startup
    runCleanup();

    // Clean temp/tmp every 5 minutes
    setInterval(() => {
        cleanDir(path.join(ROOT, 'temp'), 5 * 60 * 1000);
        cleanDir(path.join(ROOT, 'tmp'),  5 * 60 * 1000);
    }, 5 * 60 * 1000);

    // Full sweep every 30 minutes
    setInterval(runCleanup, 30 * 60 * 1000);

    // Emergency check every 10 minutes
    setInterval(emergencyCleanup, 10 * 60 * 1000);

    // Log disk stats on startup
    getDiskStats((stats) => {
        if (stats) {
            console.log(`💾 Storage: ${stats.used}/${stats.total} used (${stats.usePercent}) — ${stats.available} free`);
        }
    });

    console.log('✅ Storage Manager started — auto-cleanup active');
}

module.exports = {
    startStorageManager,
    runCleanup,
    deleteAfter,
    cleanDir,
    getDiskStats
};
