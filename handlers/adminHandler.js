const logger = require('../helpers/logger');

module.exports = {
    banUser: async (sock, message, args) => {
        try {
            const groupJid = message.key.remoteJid;
            const participant = message.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

            if (!participant) {
                return sock.sendMessage(groupJid, {
                    text: '🔍 Por favor, marque o usuário que deseja banir. Exemplo: /ban @usuário'
                }, { quoted: message });
            }

            await sock.groupParticipantsUpdate(
                groupJid,
                [participant],
                'remove'
            );

            await sock.sendMessage(groupJid, {
                text: `🚷 Usuário removido com sucesso!`
            }, { quoted: message });
        } catch (error) {
            logger.error('Erro ao banir usuário:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Não foi possível remover o usuário. Verifique minhas permissões.'
            });
        }
    },

    hideTag: async (sock, message, args) => {
        try {
            const groupJid = message.key.remoteJid;
            const text = args.join(' ');

            if (!text) {
                return sock.sendMessage(groupJid, {
                    text: '💬 Por favor, forneça uma mensagem. Exemplo: /hidetag Olá a todos'
                }, { quoted: message });
            }

            const groupMembers = await sock.groupMetadata(groupJid)
                .then(metadata => metadata.participants.map(p => p.id));

            await sock.sendMessage(groupJid, {
                text: text,
                mentions: groupMembers
            });
        } catch (error) {
            logger.error('Erro ao enviar hidetag:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Erro ao enviar mensagem oculta.'
            });
        }
    }
};
