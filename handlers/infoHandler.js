const axios = require('axios');
const logger = require('../helpers/logger');

module.exports = {
    getCEP: async (sock, message, args) => {
        if (!args[0] || !/^\\d{8}$/.test(args[0])) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '📌 Por favor, forneça um CEP válido (8 dígitos). Exemplo: /cep 12345678'
            }, { quoted: message });
        }

        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${args[0]}/json/`);

            if (data.erro) {
                return sock.sendMessage(message.key.remoteJid, {
                    text: '🔍 CEP não encontrado.'
                }, { quoted: message });
            }

            const response = `📮 *Informações do CEP ${args[0]}*\\n\\n` +
                            `📍 *Logradouro:* ${data.logradouro || 'Não informado'}\\n` +
                            `🏘️ *Bairro:* ${data.bairro || 'Não informado'}\\n` +
                            `🏙️ *Cidade:* ${data.localidade}\\n` +
                            `🇧🇷 *Estado:* ${data.uf}\\n` +
                            `📌 *CEP:* ${data.cep}\\n` +
                            `🔢 *DDD:* ${data.ddd || 'Não informado'}`;

            await sock.sendMessage(message.key.remoteJid, {
                text: response
            }, { quoted: message });
        } catch (error) {
            logger.error('Erro ao buscar CEP:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Erro ao buscar CEP. Tente novamente mais tarde.'
            });
        }
    },

    getDDD: async (sock, message, args) => {
        if (!args[0] || !/^\\d{2}$/.test(args[0])) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '📌 Por favor, forneça um DDD válido (2 dígitos). Exemplo: /ddd 11'
            }, { quoted: message });
        }

        try {
            const { data } = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${args[0]}`);

            const response = `📞 *Informações do DDD ${args[0]}*\\n\\n` +
                            `🏙️ *Estado:* ${data.state}\\n` +
                            `📍 *Cidades atendidas:*\\n${data.cities.join(', ')}`;

            await sock.sendMessage(message.key.remoteJid, {
                text: response
            }, { quoted: message });
        } catch (error) {
            logger.error('Erro ao buscar DDD:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ DDD não encontrado ou serviço indisponível.'
            });
        }
    }
};
