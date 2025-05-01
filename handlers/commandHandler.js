const stickerHandler = require('./stickerHandler');
const adminHandler = require('../helpers/adminHandler');
const infoHandler = require('./infoHandler');
const mediaHandler = require('./mediaHandler');
const aiHandler = require('../helpers/aiHandler');
const logger = require('../helpers/logger');

module.exports = async (sock, message, text, isGroup, isAdmin) => {
    const [command, ...args] = text.slice(1).split(' ');

    try {
        switch(command) {
            case 'sticker':
                await stickerHandler(sock, message, args);
                break;

            case 'ban':
                if (!isGroup) return;
                if (!isAdmin) return sock.sendMessage(message.key.remoteJid, { text: '🚫 Você precisa ser admin para usar este comando!' });
                await adminHandler.banUser(sock, message, args);
                break;

            case 'hidetag':
                if (!isGroup) return;
                if (!isAdmin) return sock.sendMessage(message.key.remoteJid, { text: '🚫 Você precisa ser admin para usar este comando!' });
                await adminHandler.hideTag(sock, message, args);
                break;

            case 'cep':
                await infoHandler.getCEP(sock, message, args);
                break;

            case 'ddd':
                await infoHandler.getDDD(sock, message, args);
                break;

            case 'youtubetomp3':
                await mediaHandler.youtubeToMp3(sock, message, args);
                break;

            case 'youtubetomp4':
                await mediaHandler.youtubeToMp4(sock, message, args);
                break;

            case 'chatgpt':
                await aiHandler.chatGPT(sock, message, args);
                break;

            case 'help':
                await showHelp(sock, message, isAdmin);
                break;

            default:
                await sock.sendMessage(message.key.remoteJid, { text: '❌ Comando não reconhecido! Digite /help para ver os comandos disponíveis.' });
        }
    } catch (error) {
        logger.error(`Erro ao processar comando ${command}:`, error);
        await sock.sendMessage(message.key.remoteJid, { text: '⚠️ Ocorreu um erro ao processar seu comando. Tente novamente mais tarde.' });
    }
};

async function showHelp(sock, message, isAdmin) {
    let helpText = '📝 *Lista de Comandos*\\n\\n';

    helpText += '🎨 */sticker* - Cria um sticker a partir de imagem\\n';
    helpText += '📌 */cep [número]* - Consulta informações de CEP\\n';
    helpText += '📞 */ddd [número]* - Consulta informações de DDD\\n';
    helpText += '🎵 */youtubetomp3 [url]* - Baixa áudio do YouTube (MP3)\\n';
    helpText += '🎥 */youtubetomp4 [url]* - Baixa vídeo do YouTube (MP4)\\n';
    helpText += '🤖 */chatgpt [pergunta]* - Pergunta ao ChatGPT\\n';

    if (isAdmin) {
        helpText += '\\n👑 *Comandos de Admin*\\n';
        helpText += '🚫 */ban @usuário* - Remove usuário do grupo\\n';
        helpText += '🔇 */hidetag [mensagem]* - Mensagem oculta para todos\\n';
    }

    await sock.sendMessage(message.key.remoteJid, { text: helpText });
}
