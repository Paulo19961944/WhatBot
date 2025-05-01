const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const { ensureTempDir } = require('../helpers/utils');
const logger = require('../helpers/logger');

module.exports = {
    youtubeToMp3: async (sock, message, args) => {
        if (!args[0] || !ytdl.validateURL(args[0])) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '🔗 Por favor, forneça um URL válido do YouTube. Exemplo: /youtubetomp3 <https://youtu.be/>...'
            }, { quoted: message });
        }

        try {
            const url = args[0];
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[^\\w\\s]/gi, '');

            await sock.sendMessage(message.key.remoteJid, {
                text: `⏳ Baixando áudio: ${title}...`
            }, { quoted: message });

            const tempDir = ensureTempDir();
            const outputPath = path.join(tempDir, `${title}.mp3`);

            ytdl(url, { quality: 'highestaudio', filter: 'audioonly' })
                .pipe(fs.createWriteStream(outputPath))
                .on('finish', async () => {
                    await sock.sendMessage(message.key.remoteJid, {
                        audio: fs.readFileSync(outputPath),
                        mimetype: 'audio/mp4',
                        fileName: `${title}.mp3`
                    }, { quoted: message });

                    fs.unlinkSync(outputPath);
                });
        } catch (error) {
            logger.error('Erro ao baixar MP3:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Erro ao baixar áudio. Verifique o link ou tente novamente.'
            });
        }
    },

    youtubeToMp4: async (sock, message, args) => {
        if (!args[0] || !ytdl.validateURL(args[0])) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '🔗 Por favor, forneça um URL válido do YouTube. Exemplo: /youtubetomp4 <https://youtu.be/>...'
            }, { quoted: message });
        }

        try {
            const url = args[0];
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[^\\w\\s]/gi, '');

            await sock.sendMessage(message.key.remoteJid, {
                text: `⏳ Baixando vídeo: ${title}...`
            }, { quoted: message });

            const tempDir = ensureTempDir();
            const outputPath = path.join(tempDir, `${title}.mp4`);

            ytdl(url, { quality: 'highest' })
                .pipe(fs.createWriteStream(outputPath))
                .on('finish', async () => {
                    await sock.sendMessage(message.key.remoteJid, {
                        video: fs.readFileSync(outputPath),
                        caption: title,
                        fileName: `${title}.mp4`
                    }, { quoted: message });

                    fs.unlinkSync(outputPath);
                });
        } catch (error) {
            logger.error('Erro ao baixar MP4:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Erro ao baixar vídeo. Verifique o link ou tente novamente.'
            });
        }
    }
};
