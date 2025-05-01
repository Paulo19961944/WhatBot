const { useMultiFileAuthState, makeInMemoryStore, Browsers } = require('@whiskeysockets/baileys');
const { makeWASocket } = require('@whiskeysockets/baileys');
const pino = require('pino');
const logger = require('./helpers/logger');

// Import handlers
const commandHandler = require('./handlers/commandHandler');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.macOS('Desktop'),
        auth: state
    });

    store.bind(sock.ev);

    // Eventos
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== 401;
            logger.info(`Conexão fechada, ${shouldReconnect ? 'reconectando' : 'não reconectando'}...`);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            logger.info('Bot conectado com sucesso!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message.message) return;

        const text = (message.message.conversation || message.message.extendedTextMessage?.text || '').toLowerCase();
        const sender = message.key.remoteJid;
        const isGroup = sender.endsWith('@g.us');
        const groupMetadata = isGroup ? await sock.groupMetadata(sender) : null;
        const isAdmin = isGroup ? groupMetadata.participants.find(p => p.id === message.key.participant)?.admin === 'admin' : false;

        if (text.startsWith('/')) {
            await commandHandler(sock, message, text, isGroup, isAdmin);
        }
    });
}

startBot().catch(err => logger.error('Erro ao iniciar o bot:', err));
