/**
 * Malai XD - A WhatsApp Bot
 * Copyright (c) 2026 Kimani Samuel
 */

require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main')
const PhoneNumber = require('awesome-phonenumber')
const readline = require('readline')

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")

const NodeCache = require("node-cache")
const pino = require("pino")
const { rmSync } = require('fs')

const store = require('./lib/lightweight_store')
store.readFromFile()

const settings = require('./settings')

let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "𝗠𝗮𝗹𝗮𝗶 𝗫𝗗 🦈"
global.themeemoji = "•"

// ✅ FIX: proper pairing flag
const pairingEnabled = process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({
    input: process.stdin,
    output: process.stdout
}) : null

const question = (text) => {
    if (rl) return new Promise(res => rl.question(text, res))
    return Promise.resolve(settings.ownerNumber || "254105197055")
}

async function startXeonBotInc() {
    try {
        let { version } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: "silent" }),

            // ❌ IMPORTANT FIX: ALWAYS disable QR when pairing mode
            printQRInTerminal: !pairingEnabled,

            browser: ["Ubuntu", "Chrome", "20.0.0"],

            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
            },

            msgRetryCounterCache,
            markOnlineOnConnect: true,
            syncFullHistory: false
        })

        XeonBotInc.ev.on('creds.update', saveCreds)

        // ==========================
        // 📦 PAIRING FIX (STEP 1)
        // ==========================
        let pairingNumber = null

        if (pairingEnabled && !XeonBotInc.authState.creds.registered) {

            if (useMobile) throw new Error("Mobile mode not supported with pairing")

            pairingNumber = await question(
                chalk.bgBlack(chalk.greenBright(
                    `Please type your WhatsApp number 🦈\nFormat: 254105197055 : `
                ))
            )

            pairingNumber = pairingNumber.replace(/[^0-9]/g, '')

            const pn = require('awesome-phonenumber')
            if (!pn('+' + pairingNumber).isValid()) {
                console.log(chalk.red("❌ Invalid number"))
                process.exit(1)
            }

            global.pairingNumber = pairingNumber
        }

        // ==========================
        // 📡 CONNECTION HANDLER
        // ==========================
        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect } = s

            if (connection === "connecting") {
                console.log(chalk.yellow("🔄 Connecting..."))
            }

            if (connection === "open") {

                console.log(chalk.green("🌿 Connected to WhatsApp"))

                // ==========================
                // 🔑 FIXED PAIRING (STEP 2)
                // ==========================
                if (
                    pairingEnabled &&
                    !XeonBotInc.authState.creds.registered &&
                    global.pairingNumber
                ) {
                    try {
                        let code = await XeonBotInc.requestPairingCode(global.pairingNumber)
                        code = code?.match(/.{1,4}/g)?.join("-") || code

                        console.log(
                            chalk.black(chalk.bgGreen("Your Pairing Code : ")),
                            chalk.white(code)
                        )

                        console.log(chalk.yellow(`
1. Open WhatsApp
2. Settings > Linked Devices
3. Link a Device
4. Enter code above
                        `))

                    } catch (err) {
                        console.log(chalk.red("❌ Pairing failed:", err.message))
                    }
                }

                console.log(chalk.blue("🤖 Bot is Ready"))
            }

            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

                if (reason === DisconnectReason.loggedOut) {
                    rmSync('./session', { recursive: true, force: true })
                    console.log(chalk.red("Session cleared, re-login required"))
                } else {
                    console.log(chalk.yellow("Reconnecting..."))
                    startXeonBotInc()
                }
            }
        })

        return XeonBotInc

    } catch (e) {
        console.log("Error:", e)
        setTimeout(startXeonBotInc, 5000)
    }
}

startXeonBotInc()

process.on("uncaughtException", console.error)
process.on("unhandledRejection", console.error)
