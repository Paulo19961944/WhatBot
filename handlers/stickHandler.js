const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');
const path = require('path');
const { ensureTempDir } = require('../helpers/utils');
const logger = require('../helpers/logger');

module.exports = async (sock, message, args) => {
    try {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isImage = quoted?.imageMessage || message.message?.imageMessage;
        const isVideo = quoted?.videoMessage || message.message?.videoMessage;

        if (!isImage && !isVideo) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '📌 Por favor, envie ou marque uma imagem/vídeo com o comando /sticker'
            });
        }

        const media = isImage ?
            (quoted?.imageMessage || message.message.imageMessage) :
            (quoted?.videoMessage || message.message.videoMessage);

        const buffer = await sock.downloadMediaMessage(media);
        const tempDir = ensureTempDir();
        const tempFile = path.join(tempDir, `sticker_${Date.now()}.${isImage ? 'png' : 'mp4'}`);

        fs.writeFileSync(tempFile, buffer);

        const stickerOptions = {
            pack: 'WhatsApp Bot',
            author: 'Baileys Bot',
            type: isImage ? StickerTypes.FULL : StickerTypes.CROPPED,
            quality: 70,
        };

        const sticker = new Sticker(tempFile, stickerOptions);
        const stickerBuffer = await sticker.toBuffer();

        await sock.sendMessage(message.key.remoteJid, {
            sticker: stickerBuffer
        }, { quoted: message });

        fs.unlinkSync(tempFile);
    } catch (error) {
        logger.error('Erro ao criar sticker:', error);
        await sock.sendMessage(message.key.remoteJid, {
            text: '❌ Erro ao criar sticker. Tente novamente com outra mídia.'
        });
    }
};
